const { v4 } = require("uuid");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
    * @method method
    * @description description
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

    console.log(sub);

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    const session = driver.session();
    const { records } = await session.run(
        `
        MERGE (user:User {id: $userId})-[:HAS]->(plan:DegreePlan {
            id: $planId
        })

        RETURN properties(plan) as plan
        `,
        { userId: sub, planId: v4() }
    );
    await session.close();
    await driver.close();

    console.log(records[0].get("plan"));

    return records[0].get("plan");
};
