const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Gets program with the given ID
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { programId } = event.pathParameters;
  // const headers = event.headers;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const result = await session.run(
    `
        MATCH(program:Program {id: $programId})
        RETURN properties(program) as program
      `,
    { programId }
  );

  await session.close();
  await driver.close();

  return result.records[0].get("program");
};
