import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParams extends APIGatewayProxyEventPathParameters {
  semesterId: string;
}

/**
 * @method method POST
 * @description description
 */
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);

  const { courses } = JSON.parse(event.body ?? "{}");
  const { semesterId } = event.pathParameters as PathParams;
  const { authorization } = event.headers;
  const { stage } = event.requestContext;

  if (!authorization) throw new Error("Unauthorized");
  const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  try {
    const session = driver.session();

    const { records } = await session.run(
      `
        MATCH (user:User {id: $userId})-[:HAS]->(:DegreePlan)-[:CONTAINS]->(semester:DegreePlanSemester { id: $semesterId })

        UNWIND $courses as course
        MATCH (c:Course {id: course})

        MERGE (semester)-[:CONTAINS]->(c)

        return properties(c) as course
      `,
      { semesterId, courses, userId: sub }
    );

    console.log(records);

    await session.close();
    await driver.close();

    return records[0].get("course");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
