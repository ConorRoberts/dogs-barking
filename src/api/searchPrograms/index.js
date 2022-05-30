const { MeiliSearch } = require("meilisearch");

/**
 * @method GET
 * @description Performs an indexed search on all programs
 */
exports.handler = async (event) => {
  console.log(event);

  try {
    const { query } = event.queryStringParameters;

    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_KEY,
    });

    const index = client.index("programs");

    const { hits } = await index.search(query);

    return hits;
  } catch (error) {
    console.error(error);
    return [];
  }
};
