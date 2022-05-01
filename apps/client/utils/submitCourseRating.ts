import getNeo4jDriver from "./getNeo4jDriver";
import RatingData from "@typedefs/RatingData";
import { v4 } from "uuid";

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
    CALL {
      MATCH (u:User {id: $user}),(c:Course {id: $course})
      
      MERGE (u)-[:RATED]->(rating:Rating)<-[:HAS_RATING]-(c)
      ON CREATE
        SET rating.id = $id
      
      SET rating.${ratingType} = $rating
      SET rating.updatedAt = timestamp()
    }
    
    OPTIONAL MATCH (c)-[:HAS_RATING]->(allRatings:Rating)

    RETURN
      avg(allRatings.difficulty) as difficulty,
      avg(allRatings.timeSpent) as timeSpent,
      avg(allRatings.usefulness) as usefulness,
      count(allRatings) as ratingCount
    `,
    { user, course, rating: Number(rating), id: v4() }
  );

  await session.close();
  await driver.close();

  return {
    difficulty: records[0]?.get("difficulty") ?? 0,
    timeSpent: records[0]?.get("timeSpent") ?? 0,
    usefulness: records[0]?.get("usefulness") ?? 0,
    ratingCount: records[0]?.get("ratingCount").low ?? 0,
  };
};

export default submitCourseRating;
