import User from "@typedefs/User";
import getNeo4jDriver from "./getNeo4jDriver";

const updateUser = async (id: string, data: User) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const { records } = await session.run(
    `
        MERGE (user:User {id: $id})

        SET user.major = $major
        SET user.minor = $minor
        SET user.school = $school

        RETURN properties(user) as user
        `,
    { major: "", minor: "", school: "", ...data, id }
  );

  return {
    ...records[0].get("user"),
  };
};

export default updateUser;
