import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  courseId: string;
  semesterId: string;
}

/**
 * @method DELETE
 * @description Delete a course by ID from a degree plan semester
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
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

    // const body = JSON.parse(event.body ?? "{}");
    // const query = event.queryStringParameters;
    const { courseId, semesterId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");

    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    await session.run(
      `
    MATCH 
      (:User {id: $userId})-[:HAS]->
      (:DegreePlan)-[:CONTAINS]->
      (:DegreePlanSemester {id: $semesterId})-[r:CONTAINS]->(:Course {id: $courseId})

      DELETE r
  `,
      { userId: sub, courseId, semesterId }
    );

    return {};
  } catch (error) {
    console.error("An error has occurred", error);
    throw error;
  } finally {
    await driver.close();
  }
};
