import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import DegreePlan from "@dogs-barking/common/DegreePlan";

/**
 * @method method GET
 * @description Get degree plans associated with a user
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<DegreePlan[]>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );
  try {
    console.log(event);

    // const body = JSON.parse(event.body ?? "{}");
    // const query = event.queryStringParameters;
    // const pathParams = event.pathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");

    const { sub } = jwt.decode(authorization?.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();
    const { records } = await session.run(
      `
        MATCH (user:User {id: $userId})-[:HAS]->(plan: DegreePlan)

        RETURN properties(plan) as plan
        `,
      { userId: sub }
    );
    await session.close();

    return records.map((e) => ({ ...e.get("plan") }));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
