import { MeiliSearch } from "meilisearch";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import Course from "@dogs-barking/common/Course";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  query: string;
}

/**
 * @method GET
 * @description Performs an indexed search on all courses
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<Course[]>> => {
  console.log(event);

  try {
    const { query } = event.queryStringParameters as Query;

    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST as string,
      apiKey: process.env.MEILISEARCH_KEY as string,
    });

    const index = client.index("courses");

    const { hits } = await index.search(query);

    return hits as Course[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
