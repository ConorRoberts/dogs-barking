import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import User from "@dogs-barking/common/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

/**
 * @method GET
 * @description Gets a user
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<User>> => {
  const { stage } = event.requestContext;
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  try {
    console.log(event);

    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      `
        MATCH (user:User {id: $id})

        OPTIONAL MATCH (user)-[:ATTENDS]->(school: School)
        OPTIONAL MATCH (user)-[:STUDIES_MAJOR]->(major: Program)
        OPTIONAL MATCH (user)-[:STUDIES_MINOR]->(minor: Program)

        RETURN 
          properties(user) as user,
          properties(minor) as minor,
          properties(major) as major,
          properties(school) as school,
          [(user)-[:HAS_TAKEN]->(course:Course) | properties(course)] as takenCourses
    `,
      { id: sub }
    );

    await session.close();
    await driver.close();

    return {
      ...records[0].get("user"),
      school: records[0].get("school"),
      major: records[0].get("major"),
      minor: records[0].get("minor"),
      takenCourses: records[0].get("takenCourses") ?? [],
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
