import User from "@typedefs/User";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Creates a user in Neo4j using properties given to Cognito upon sign-up.
 * This function should only be called as a side effect to a sign-up event.
 * @param attributes User attributes
 */
const createUser = async (attributes: User) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const res = await session.run(
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
    { ...attributes, birthdate: attributes.birthdate.slice(0, 10), major: "", minor: "", school: "" }
  );

  await session.close();
  await driver.close();

  return res.records[0].get("user");
};

export default createUser;
