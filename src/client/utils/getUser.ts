import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets user from Neo4j
 * @param id
 * @returns
 */
const getUser = async (id: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const result = await session.run(
    `
        MATCH (user:User {id: $id})
        RETURN 
          properties(user) as user
    `,
    { id }
  );

  await session.close();

  return {
    ...result.records[0].get("user"),
  };
};

export default getUser;
