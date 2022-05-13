const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");

/**
* @method method POST
* @description description
*/
exports.handler = async (
  event
) => {
  console.log(event);

  const { courses } = JSON.parse(event.body ?? "{}");
  const { semesterId } = event.pathParameters;
  const {authorization} = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );
  const session = driver.session();
  const result = await session.run(
    `
        MATCH (user:User {id: $userId})-[:HAS]->(:DegreePlan)-[:CONTAINS]->(semester:DegreePlanSemester { id: $semesterId })

        UNWIND $courses as course
        MATCH (c:Course {id: course})

        MERGE (semester)-[:CONTAINS]->(c)
      `,
    { semesterId, courses, userId: sub }
  );
  console.log(result);
  await session.close();
  await driver.close();

  return {
    statusCode: 201,
    body: {}
  };
};