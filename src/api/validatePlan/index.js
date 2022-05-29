const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
 * @method method
 * @description description
 */
exports.handler = async (event) => {
  console.log(event);

  const body = JSON.parse(event.body ?? "{}");
  const query = event.queryStringParameters;
  const { planId } = event.pathParameters;
  const { authorization } = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  await session.run(
    `
      MATCH (user:User {id:$userId})-[:HAS_TAKEN]-(takenCourse:Course)
      MATCH (user:User {id:$userId})-[:STUDIES_MAJOR]->(:Program)-[:MAJOR_REQUIRES|REQUIRES]->(majorCourse:Course)
      MATCH (user:User {id:$userId})-[:HAS]->(d:DegreePlan {id: $planId})-[:CONTAINS]->(:DegreePlanSemester)-[:CONTAINS]->(plannedCourse:Course)

      WITH 
        collect(distinct(takenCourse.id)) as takenCourse,
        collect(distinct(majorCourse.id)) as majorCourse, 
        collect(distinct(plannedCourse.id)) as plannedCourse

      WITH 
        [n in majorCourse where n in plannedCourse or n in takenCourse] as validCourse,
        majorCourse

      return size(validCourse)=size(majorCourse), size(majorCourse), size(validCourse)
  `,
    { userId: sub, planId }
  );

  // 1. We need the users taken courses, the courses within the specified plan, and the courses within the user's major

  await session.close();
  await driver.close();

  return "Hello World";
};
