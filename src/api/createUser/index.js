const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
* @method POST
* @description Creates metadata for a Cognito user within Neo4j
*/
exports.handler = async (
    event
) => {
    console.log(event);

    const body = JSON.parse(event.body ?? "{}");
    const query = event.queryStringParameters;
    const pathParams = event.pathParameters;
    const headers = event.headers;

    const { sub } = jwt.decode(headers.authorization.replace("Bearer", ""));

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    await driver.close();

    return {
        data: "Hello World",
    };
};