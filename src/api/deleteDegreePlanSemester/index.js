const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
* @method method GET
* @description Deletes a semester from a degree plan
*/
exports.handler = async (
    event
) => {
    console.log(event);

    const body = JSON.parse(event.body ?? "{}");
    const { semesterId } = event.queryStringParameters;
    const headers = event.headers;

    if (semesterId === undefined || typeof semesterId !== "string") throw new Error("Invalid semester id");

    const token = jwt.decode(headers.Authorization.replace("Bearer", ""));

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();
    await session.run(
        `
          MATCH (user:User {id: $userId})-[:HAS]->(dp:DegreePlan)-[:CONTAINS]->(semester: DegreePlanSemester {id: $semesterId})
          DETACH DELETE semester
      `,
        { semesterId, userId: token.sub }
    );
    await session.close();
    await driver.close();

    return {};
};