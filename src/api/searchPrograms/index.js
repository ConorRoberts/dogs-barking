const neo4j = require("neo4j-driver");

/**
* @method GET
* @description Searches programs
*/
exports.handler = async (
  event
) => {
  console.log(event);

  try {
    // const body = JSON.parse(event.body ?? "{}");
    const { query } = event.queryStringParameters;
    // const pathParams = event.pathParameters;
    // const headers = event.headers;

    const driver = neo4j.driver(
      `neo4j://${process.env.NEO4J_HOST}`,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    const { records } = await session.run(
      `
              CALL db.index.fulltext.queryNodes("programSearch", $query) 
              YIELD node, score
              RETURN properties(node) as program, score
              order by score DESC 
              limit(${15})
            `,
      {
        query: `name:${query}* OR short:"${query}"`,
      }
    );

    await session.close();
    await driver.close();

    return records.map((e) => ({
      id: e.get("program").id,
      name: e.get("program").name,
      short: e.get("program").short,
      degree: e.get("program").degree,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};