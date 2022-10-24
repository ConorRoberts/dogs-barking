import jwt, { JwtPayload } from "jsonwebtoken";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { getNeo4jDriver } from "@dogs-barking/common";

/**
 * @method POST
 * @description Creates metadata for a Cognito user within Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  // Get Neo4j credentials
  const driver = await getNeo4jDriver("dev");

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
