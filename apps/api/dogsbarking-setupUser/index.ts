import { PostConfirmationTriggerHandler } from "aws-lambda";
import { getNeo4jDriver } from "@dogs-barking/common";

/**
 * @method POST
 * @description Creates metadata for a Cognito user within Neo4j
 */
export const handler: PostConfirmationTriggerHandler = async (event, _context, callback) => {
  console.log(JSON.stringify(event));

  const userData = {
    id: event.request.userAttributes.sub,
    name: event.request.userAttributes.name ?? "",
    email: event.request.userAttributes.email,
    roles: ["user"],
  };

  const driver = await getNeo4jDriver("dev");

  try {
    const session = driver.session();

    await session.run(
      `
        MERGE (user: User {
            id: $id,
            email: $email,
            name: $name,
            school: $school,
            major: $major,
            minor: $minor,
            roles: $roles
        })

        return properties(user) as user
    `,
      { ...userData, major: "", minor: "", school: "" }
    );

    await session.close();

    return callback(null, event);
  } catch (error) {
    console.error(error);
    return callback(error as Error, event);
  } finally {
    await driver.close();
  }
};
