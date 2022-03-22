import UserAttributes from "@typedefs/CognitoUser";
import getNeo4jDriver from "./getNeo4jDriver";

const createUser = async (attributes: UserAttributes) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  await session.run(
    `
        MERGE (u:User {
            sub: $sub,
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
