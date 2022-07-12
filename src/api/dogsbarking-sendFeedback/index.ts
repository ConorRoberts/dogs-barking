import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import neo4j from "neo4j-driver";

interface Body {
  title: string;
  message: string;
}

/**
 * @method POST
 * @description Sends user feedback from the client to Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: "development/dogs-barking/neo4j",
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  try {
    console.log(event);

    // const headers = event.headers;
    const { title, message } = JSON.parse(event.body ?? "{}") as Body;

    const session = driver.session();

    const { records } = await session.run(
      `
        CREATE (f:Feedback {
          title: $data.title,
          message: $data.message,
          createdAt: datetime()
        })
        
        RETURN 
          properties(f) as feedback
      `,
      { data: { title, message } }
    );

    await session.close();

    return records[0].get("feedback");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
