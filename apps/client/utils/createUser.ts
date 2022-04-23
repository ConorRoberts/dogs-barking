import UserAttributes from "@typedefs/CognitoUser";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Creates a user in Neo4j using properties given to Cognito upon sign-up.
 * This function should only be called as a side effect to a sign-up event.
 * @param attributes User attributes
 */
const createUser = async (attributes: UserAttributes) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  await session.run(
    `
        MERGE (u:User {
            id: $sub,
            email: $email,
            birthdate: date($birthdate),
            name: $name
        })
    `,
    { ...attributes, birthdate: attributes.birthdate.slice(0, 10) }
  );

  await session.close();
  await driver.close();
};

export default createUser;
