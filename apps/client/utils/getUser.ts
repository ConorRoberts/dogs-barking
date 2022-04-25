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
        MATCH (user:User)
        WHERE user.id = $id
        RETURN 
          properties(user) as user
    `,
    { id }
  );

  await session.close();

  return {
    ...result.records[0].get("user"),
    birthdate: Object.values(result.records[0].get("user").birthdate)
      .map((e: { high: number; low: number }) => e.low.toString().padStart(2, "0"))
      .join("-"),
  };
};

export default getUser;
