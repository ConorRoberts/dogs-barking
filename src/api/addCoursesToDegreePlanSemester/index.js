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
    const headers = event.headers;

    const { sub } = jwt.decode(headers.Authorization.replace("Bearer", ""));

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    const session = driver.session();
    await session.run(
        `
        MATCH (user:User {id: $userId})-[]->(semester:DegreePlanSemester { id: $semesterId })

        UNWIND $courses as course
        MATCH (c:Course {id: course})
        MERGE (semester)-[:CONTAINS]->(c)
      `,
        { semesterId, courses, userId: sub }
    );
    await session.close();
    await driver.close();

    return {
        statusCode: 201,
        body: {}
    };
};