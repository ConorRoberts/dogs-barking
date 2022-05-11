const neo4j = require("neo4j-driver");

/**
* @method GET
* @description Performs an indexed search on all courses
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
            CALL db.index.fulltext.queryNodes("courseSearch", $query) 
            YIELD node, score
            RETURN properties(node) as course, score
            order by score DESC 
            limit(15)
          `,
      {
        query: `code:${query}* OR name:"${query}"`,
      }
    );

    await session.close();
    await driver.close();

    return records.map((e) => ({
      name: e.get("course").name,
      id: e.get("course").id,
      description: e.get("course").description,
      code: e.get("course").code,
      credits: e.get("course").credits,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};