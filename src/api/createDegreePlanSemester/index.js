const neo4j = require("neo4j-driver");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

/**
* @method method POST
* @description Creates a new semester in a degree plan
*/
exports.handler = async (
    event
) => {
    console.log(event);

    const { planId } = event.pathParameters;
    const headers = event.headers;

    if (planId === undefined || typeof planId !== "string") throw new Error("Invalid id");

    const { sub } = jwt.decode(headers.authorization.replace("Bearer", ""));

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    const { records } = await session.run(
        `
          MATCH (user: User {id: $userId})-[]->(dp:DegreePlan {id: $planId})

          CREATE (dp)-[:CONTAINS]->(s:DegreePlanSemester {id: $semesterId, year: $year, semester: $semester})

          RETURN properties(s) as semester
      `,
        { planId, semesterId: v4(), year: new Date().getFullYear(), semester: "winter", userId: sub }
    );

    return records[0].get("semester");
};