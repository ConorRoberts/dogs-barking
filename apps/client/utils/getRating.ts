import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets the previous ratings for a node (Course)
 * @param id Course ID
 */
const getRating = async (id: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const { records } = await session.run(
    `
        MATCH (c:Course {id: $id})-[:HAS_RATING]->(rating:Rating)
        
        RETURN
          avg(rating.difficulty) as difficulty,
          avg(rating.timeSpent) as timeSpent,
          avg(rating.usefulness) as usefulness,
          count(rating) as ratingCount
    `,
    { id }
  );

  await session.close();
  await driver.close();

  return {
    difficulty: records[0]?.get("difficulty") ?? 0,
    usefulness: records[0]?.get("usefulness") ?? 0,
    timeSpent: records[0]?.get("timeSpent") ?? 0,
    ratingCount: records[0]?.get("ratingCount").low ?? 0,
  };
};

export default getRating;
