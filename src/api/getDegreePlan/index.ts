import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import DegreePlan, { PlannerSemesterData } from "@dogs-barking/common/DegreePlan";
import jwt, { JwtPayload } from "jsonwebtoken";
import Course from "@dogs-barking/common/Course";
import Section from "@dogs-barking/common/Section";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  planId: string;
}

/**
 * @method GET
 * @description Gets a degree plan
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<DegreePlan>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    // const body = JSON.parse(event.body ?? "{}");
    // const query = event.queryStringParameters;
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
    await driver.close();

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
