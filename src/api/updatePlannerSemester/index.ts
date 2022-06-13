import jwt from "jsonwebtoken";
import neo4j from "neo4j-driver";

/**
 * @method POST
 * @description description
 */
export const handler = async (event) => {
  console.log(event);

  const { data } = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { semesterId } = event.pathParameters;
  const { authorization } = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
          MATCH (user:User {id: $userId})-[:HAS]->(dp:DegreePlan)-[:CONTAINS]->(semester: DegreePlanSemester {id: $semesterId})

          SET semester.semester = $data.semester
          SET semester.year = $data.year
          
          return properties(semester) as semester, [(semester)-[:CONTAINS]->(course:Course) | properties(course)] as courses
      `,
    { data, userId: sub, semesterId }
  );

  await session.close();
  await driver.close();

  return { ...records[0].get("semester"), courses: records[0].get("courses") };
};