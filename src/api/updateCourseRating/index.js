const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

/**
 * @method POST
 * @description Updates the rating for a course
 */
exports.handler = async (event) => {
  console.log(event);

  const { courseId, ratingType, ratingValue } = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  const headers = event.headers;

  const { sub } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const ratingTypes = ["difficulty", "timeSpent", "usefulness"];

  if (!ratingTypes.includes(ratingType)) throw new Error("Invalid rating type");

  const session = driver.session();

  const { records } = await session.run(
    `
    CALL {
      MATCH (user:User {id: $userId}),(course:Course {id: $courseId})

      MERGE (user)-[:RATED]->(rating:Rating)<-[:HAS_RATING]-(course)
      
      ON CREATE
        SET rating.id = $id
      
      SET rating.${ratingType} = $rating
      SET rating.updatedAt = timestamp()
    }
    
    MATCH (course: Course {id: $courseId})-[:HAS_RATING]->(allRatings:Rating)<-[:RATED]-(user:User)

    RETURN
      avg(allRatings.difficulty) as difficulty,
      avg(allRatings.timeSpent) as timeSpent,
      avg(allRatings.usefulness) as usefulness,
      count(allRatings) as ratingCount
    `,
    { userId: sub, courseId, rating: Number(ratingValue), id: v4(), ratingType }
  );

  await session.close();
  await driver.close();

  return {
    difficulty: records[0]?.get("difficulty") ?? 0,
    timeSpent: records[0]?.get("timeSpent") ?? 0,
    usefulness: records[0]?.get("usefulness") ?? 0,
    count: records[0]?.get("ratingCount").low ?? 0,
  };
};
