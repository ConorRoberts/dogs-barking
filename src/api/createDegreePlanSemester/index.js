const neo4j = require("neo4j-driver");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

/**
 * @method method POST
 * @description Creates a new semester in a degree plan
 */
exports.handler = async (event) => {
  console.log(event);

  const { planId } = event.pathParameters;
  const { authorization } = event.headers;
  const { data } = JSON.parse(event.body ?? "{}");

  if (planId === undefined || typeof planId !== "string") throw new Error("Invalid id");

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
          MATCH (user: User {id: $userId})-[]->(dp:DegreePlan {id: $planId})

          CREATE (dp)-[:CONTAINS]->(s:DegreePlanSemester $data)

          RETURN properties(s) as semester
      `,
    {
      planId,
      userId: sub,
      data: {
        year: data?.year ?? new Date().getFullYear(),
        semester: data?.semester ?? "winter",
        id: v4(),
      },
    }
  );

  return {
    ...records[0].get("semester"),
    courses: [],
  };
};
