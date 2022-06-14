import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { PlannerSemesterData } from "@dogs-barking/common/DegreePlan";
import jwt, { JwtPayload } from "jsonwebtoken";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  semesterId: string;
}

/**
 * @method GET
 * @description Get a semester with a specific id
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<PlannerSemesterData>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);
    console.log(event);

    // const body = JSON.parse(event.body ?? "{}");
    // const query = event.queryStringParameters;
    const { semesterId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      `
      MATCH (user:User {id: $userId})-->(dp:DegreePlan)-->(semester: DegreePlanSemester {id: $semesterId})
      
      RETURN
        [(c:Course)<--(semester) | 
          {
            course: properties(c),
            section: [(c)-->(s:Section)<--(semester) | properties(s)][0]
          }
        ] as courses,
        properties(semester) as semester
      `,
      { userId: sub, semesterId }
    );

    await session.close();
    await driver.close();

    return {
      ...records[0].get("semester"),
      courses: records[0].get("courses").map(({ course, section }: any) => ({ ...course, section })),
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
