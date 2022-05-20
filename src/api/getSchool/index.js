const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Get returns a school with the given ID from Neo4j
 */
exports.handler = async (event) => {
  console.log(event);

  const { schoolId } = event.pathParameters;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const { records } = await session.run(
    `
    MATCH (school:School {id: $schoolId}) 
  
    RETURN properties(school) as school
    `,
    { schoolId }
  );
  await session.close();
  await driver.close();

  return records[0].get("school");
};
