const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");

/**
 * @method DELETE
 * @description Delete a course by ID from a degree plan semester
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { courseId, semesterId } = event.pathParameters;
  const { authorization } = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  await session.run(
    `
    MATCH 
      (:User {id: $userId})-[:HAS]->
      (:DegreePlan)-[:CONTAINS]->
      (:DegreePlanSemester {id: $semesterId})-[r:CONTAINS]->(:Course {id: $courseId})

      DELETE r
  `,
    { userId: sub, courseId, semesterId }
  );

  await session.close();
  await driver.close();

  return {};
};
