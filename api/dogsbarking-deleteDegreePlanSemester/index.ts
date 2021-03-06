import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  semesterId: string;
}

/**
 * @method method GET
 * @description Deletes a semester from a degree plan
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
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

    const { semesterId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (semesterId === undefined || typeof semesterId !== "string") throw new Error("Invalid semester id");

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization?.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();
    await session.run(
      `
          MATCH (user:User {id: $userId})-[:HAS]->(dp:DegreePlan)-[:CONTAINS]->(semester: DegreePlanSemester {id: $semesterId})
          DETACH DELETE semester
      `,
      { semesterId, userId: sub }
    );
    await session.close();
    await driver.close();

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
