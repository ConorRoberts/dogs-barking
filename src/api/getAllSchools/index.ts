const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Gets all schools from our DB
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  // const headers = event.headers;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const data = await session.run(
    `
    MATCH (school:School)
    RETURN
      properties(school) as school,
      [
        (school)-[:OFFERS]->(program:Program) | 
        {
          program: properties(program),
          hasMajor: size([(program)-[:MAJOR_REQUIRES]->(e) | e]) > 0,
          hasMinor: size([(program)-[:MINOR_REQUIRES]->(e) | e]) > 0
        }
      ] as programs
    `
  );

  await session.close();

  return data.records.map((record) => ({
    programs: record
      .get("programs")
      .map(({ program, ...e }) => ({ ...program, ...e }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    ...record.get("school"),
  }));
};
