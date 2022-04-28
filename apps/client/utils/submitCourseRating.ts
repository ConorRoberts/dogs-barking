import getNeo4jDriver from "./getNeo4jDriver";
import RatingData from "@typedefs/RatingData";

type RatingType = "difficulty" | "timeSpent" | "usefulness";

/**
 * Pushes a new rating to the database
 * @param user User ID that is submitting the rating
 * @param course Course ID
 * @param ratingType Type of rating
 * @param rating Value of rating
 * @returns The new rating data, averaged over all ratings
 */
const submitCourseRating = async (
  user: string,
  course: string,
  ratingType: RatingType,
  rating: number
): Promise<RatingData> => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const { records } = await session.run(
    `
    MATCH (u:User {id: $user})
    MATCH (c:Course)
    WHERE c.id = $course
    MATCH (c)-[:HAS_RATING]->(allRatings:Rating)

    MERGE (u)-[:RATED]->(rating:Rating)<-[:HAS_RATING]-(c)

    SET rating.${ratingType} = $rating
    SET rating.updatedAt = timestamp()

    RETURN 
      avg(allRatings.difficulty) as difficulty,
      avg(allRatings.timeSpent) as timeSpent,
      avg(allRatings.usefulness) as usefulness
  `,
    { user, course, rating: +rating }
  );

  await session.close();
  await driver.close();

  return {
    difficulty: records[0]?.get("difficulty") ?? 0,
    timeSpent: records[0]?.get("timeSpent") ?? 0,
    usefulness: records[0]?.get("usefulness") ?? 0,
  };
};

export default submitCourseRating;
