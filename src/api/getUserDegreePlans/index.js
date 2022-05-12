const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
* @method method GET
* @description Get degree plans associated with a user
*/
exports.handler = async (
  event
) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  const headers = event.headers;

  const { sub } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const { records } = await session.run(
    `
        MATCH (user:User {id: $userId})-[:HAS]->(plan: DegreePlan)

        RETURN 
        properties(plan) as plan,
        [(plan)-[:CONTAINS]->(semester:DegreePlanSemester) | {
          semester: properties(semester),
          courses: [(semester)-[:CONTAINS]->(course:Course) | properties(course)]
        }] as semesters
        `,
    { userId: sub }
  );

  await session.close();
  await driver.close();

  return records.map(e => ({
    ...e.get("plan"),
    semesters: records[0].get("semesters").map((s) => ({ ...s.semester, courses: e.courses }))
  }));
}