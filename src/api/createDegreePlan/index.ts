import { v4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import DegreePlan from "@dogs-barking/common/DegreePlan";

/**
 * @method POST
 * @description Creates a new degree plan for a user
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<DegreePlan>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");

    const { sub } = jwt.decode(authorization?.replace("Bearer ", "")) as JwtPayload;

    console.log(sub);

    const planId = v4();
    const session = driver.session();
    const { records } = await session.run(
      `
          MERGE (user:User {id: $userId})-[:HAS]->(plan:DegreePlan {
              id: $planId,
              name: $name
          })
  
          RETURN properties(plan) as plan
          `,
      { userId: sub, planId, name: `New Plan ${planId.slice(0, 4)}` }
    );
    await session.close();

    console.log(records[0].get("plan"));

    return records[0].get("plan");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
