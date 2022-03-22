import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets the previous ratings for a node (Course)
 * @param nodeId
 */
const getRating = async (nodeId: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const result = await session.run(
    `
        MATCH (c:Course) 
        WHERE ID(c) = $nodeId
        MATCH (c)-[:HAS_RATING]->(rating:Rating)
        RETURN 
          avg(rating.difficulty) as difficulty,
          avg(rating.timeSpent) as timeSpent,
          avg(rating.usefulness) as usefulness
    `,
    { nodeId: +nodeId }
  );

  await session.close();
  await driver.close();

  return {
    difficulty: result.records[0]?.get("difficulty") ?? 0,
    usefulness: result.records[0]?.get("usefulness") ?? 0,
    timeSpent: result.records[0]?.get("timeSpent") ?? 0,
  };
};

export default getRating;
