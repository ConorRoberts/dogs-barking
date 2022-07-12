import { MeiliSearch } from "meilisearch";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import Program from "@dogs-barking/common/Program";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  query: string;
}

/**
 * @method GET
 * @description Performs an indexed search on all programs
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<Program[]>> => {
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

    const index = client.index("programs");

    const { hits } = await index.search(query);

    return hits as Program[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
