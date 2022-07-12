import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import DegreePlan, { PlannerSemesterData } from "@dogs-barking/common/DegreePlan";
import jwt, { JwtPayload } from "jsonwebtoken";
import Course from "@dogs-barking/common/Course";
import Section from "@dogs-barking/common/Section";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  planId: string;
}

/**
 * @method GET
 * @description Gets a degree plan
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<DegreePlan>> => {
  const { stage } = event.requestContext;
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  try {
    console.log(event);

    const { planId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization?.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      ` 
        MATCH (user: User)-[:HAS]->(plan: DegreePlan {id: $planId})
        RETURN 
          properties(plan) as plan,
          [(plan)-->(semester:DegreePlanSemester) | 
            {
              semester: properties(semester),
              courses: [(semester)-->(c:Course) | 
                {
                  course: properties(c),
                  section: [(c)-->(s:Section)<--(semester) | properties(s)][0]
                }
              ]
          }] as semesters
    `,
      {
        id: sub,
        planId,
      }
    );

    await session.close();

    return {
      ...records[0].get("plan"),
      semesters: records[0]
        .get("semesters")
        .map(
          ({
            semester,
            courses,
          }: {
            semester: PlannerSemesterData;
            courses: { course: Course; section: Section }[];
          }) => ({
            ...semester,
            courses: courses.map(({ course, section }) => ({ ...course, section })),
          })
        ),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
