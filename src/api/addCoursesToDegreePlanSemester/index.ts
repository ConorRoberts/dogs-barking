import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import jwt from "jsonwebtoken";
import neo4j from "neo4j-driver";

interface PathParams extends APIGatewayProxyEventPathParameters {
  semesterId: string;
}

/**
 * @method method POST
 * @description description
 */
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);

  const { courses } = JSON.parse(event.body ?? "{}");
  const { semesterId } = event.pathParameters as PathParams;
  const { authorization } = event.headers;

  if (!authorization) throw new Error("Unauthorized");
  const { sub }: any = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );
  const session = driver.session();

  const { records } = await session.run(
    `
          MATCH (user:User {id: $userId})-[:HAS]->(:DegreePlan)-[:CONTAINS]->(semester:DegreePlanSemester { id: $semesterId })
  
          UNWIND $courses as course
          MATCH (c:Course {id: course})
  
          MERGE (semester)-[:CONTAINS]->(c)

          return properties(c) as course
        `,
    { semesterId, courses, userId: sub }
  );

  console.log(records);

  await session.close();
  await driver.close();

  return records[0].get("course");
};
