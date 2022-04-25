import User from "@typedefs/User";
import getNeo4jDriver from "./getNeo4jDriver";

const updateUser = async (id: string, data: User) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const result = await session.run(
    `
        MATCH (user:User {id: $id})

        SET user.major = $major
        SET user.minor = $minor
        SET user.school = $school

        RETURN properties(user) as user
        `,
    { ...data, id }
  );

  return {
    ...result.records[0].get("user"),
    birthdate: Object.values(result.records[0].get("user").birthdate)
      .map((e: { high: number; low: number }) => e.low.toString().padStart(2, "0"))
      .join("-"),
  };
};

export default updateUser;
