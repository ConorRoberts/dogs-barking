import { MeiliSearch } from "meilisearch";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import Program from "@dogs-barking/common/Program";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  query: string;
}

/**
 * @method GET
 * @description Performs an indexed search on all programs
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<Program[]>> => {
  console.log(event);

  try {
    const { query } = event.queryStringParameters as Query;

    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST as string,
      apiKey: process.env.MEILISEARCH_KEY as string,
    });

    const index = client.index("programs");

    const { hits } = await index.search(query);

    return hits as Program[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
