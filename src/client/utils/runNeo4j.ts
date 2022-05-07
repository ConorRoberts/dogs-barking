import getNeo4jDriver from "@utils/getNeo4jDriver";

/**
 * Runs some Neo4j query and returns the result.
 * @param query Cypher query string
 * @param params Query parameters
 * @returns Records from the query
 */
const runNeo4j = async (query: string, params: object) => {
  const driver = getNeo4jDriver();
  const session = driver.session();
  
  try {
    const { records } = await session.run(query, params);
    return records;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await session.close();
    await driver.close();
  }
};

export default runNeo4j;
