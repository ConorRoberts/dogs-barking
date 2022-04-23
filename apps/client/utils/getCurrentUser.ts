import getNeo4jDriver from "./getNeo4jDriver";
import { Auth } from "aws-amplify";

/**
 * Gets user from Neo4j
 * @param id
 * @returns
 */
const getCurrentUser = async () => {
  const driver = getNeo4jDriver();

  const user = await Auth.currentAuthenticatedUser();

  if (!user) return null;

  const id = user.attributes.sub;

  const session = driver.session();

  const result = await session.run(
    `
        MATCH (user:User)
        WHERE user.id = $id
        RETURN properties(user) as user
    `,
    { id }
  );

  await session.close();

  return result[0].get("user");
};

export default getCurrentUser;
