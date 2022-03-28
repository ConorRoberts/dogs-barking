import getNeo4jDriver from "./getNeo4jDriver";

type RatingType = "difficulty" | "timeSpent" | "usefulness";

const submitCourseRating = async (userId: string, courseNodeId: string, ratingType: RatingType, rating: number) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  await session.run(
    `
    MATCH (u:User {sub: $userId})
    MATCH (c:Course)
    WHERE id(c) = $courseNodeId

    MERGE (u)-[:RATED]->(r:Rating)<-[:HAS_RATING]-(c)

    SET r.${ratingType} = $rating
    SET r.updatedAt = timestamp()
  `,
    { userId, courseNodeId: +courseNodeId, rating: +rating }
  );

  await session.close();
  await driver.close();
};

export default submitCourseRating;
