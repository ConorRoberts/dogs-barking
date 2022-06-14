import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";

/**
 * @method POST
 * @description Creates metadata for a Cognito user within Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const { authorization } = event.headers;
    if (!authorization) throw new Error("Unauthorized");
    const { sub, birthdate, name, email } = jwt.decode(authorization?.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      `
        MERGE (user: User {
            id: $sub,
            email: $email,
            birthdate: date($birthdate),
            name: $name,
            school: $school,
            major: $major,
            minor: $minor
        })

        return properties(user) as user
    `,
      { sub, email, name, birthdate: birthdate.slice(0, 10), major: "", minor: "", school: "" }
    );

    await session.close();
    await driver.close();

    return records[0].get("user");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
