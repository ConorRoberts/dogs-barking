const { Client } = require("@opensearch-project/opensearch");

/**
 * @method GET
 * @description Performs an indexed search on all courses
 */
exports.handler = async (event) => {
  console.log(event);

  try {
    // const body = JSON.parse(event.body ?? "{}");
    const { query } = event.queryStringParameters;
    // const pathParams = event.pathParameters;
    // const headers = event.headers;

    const client = new Client({
      node: `https://${process.env.OPENSEARCH_USERNAME}:${process.env.OPENSEARCH_PASSWORD}@${process.env.OPENSEARCH_URL}`,
    });

    const response = await client.search({
      index: "courses",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["department", "code", "name"],
          },
        },
      },
    });

    return response.body.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error(error);
    return [];
  }
};
