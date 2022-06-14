import neo4j from "neo4j-driver";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 } from "uuid";
import { APIGatewayEvent } from "aws-lambda";

/**
 * @method POST
 * @description Updates the rating for a course
 */
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);

  const { courseId, ratingType, ratingValue } = JSON.parse(event.body ?? "{}");
  const { authorization } = event.headers;

  if (!authorization) throw new Error("Unauthorized");

  const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  const ratingTypes = ["difficulty", "timeSpent", "usefulness"];

  if (!ratingTypes.includes(ratingType)) throw new Error("Invalid rating type");

  const session = driver.session();

  const { records } = await session.run(
    `
    CALL {
      MATCH (user:User {id: $userId})
      MATCH (course:Course {id: $courseId})

      MERGE (user)-[r:RATED]->(course)
      
      ON CREATE
        SET r.id = $id
      
      SET r:[$ratingType] = $r
      SET r.updatedAt = timestamp()
    }
    
    MATCH (course: Course {id: $courseId})<-[allRatings:RATED]-(user:User)

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
