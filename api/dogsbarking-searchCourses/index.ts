import { MeiliSearch } from "meilisearch";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import Course from "@dogs-barking/common/Course";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  query: string;
}

/**
 * @method GET
 * @description Performs an indexed search on all courses
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<Course[]>> => {
  console.log(event);
  const { stage } = event.requestContext;
  const secrets = new SecretsManager({});

  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/meilisearch`,
  });

  const { host, apiKey } = JSON.parse(neo4jCredentials ?? "{}");
  try {
    const { query } = event.queryStringParameters as Query;

    const client = new MeiliSearch({
      host,
      apiKey,
    });

    // Get Neo4j credentials

    const index = client.index("courses");

    const { hits } = await index.search(query);

    return hits as Course[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
