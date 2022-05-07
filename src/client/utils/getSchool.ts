import getNeo4jDriver from "./getNeo4jDriver";

const getSchool = async (id: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const data = await session.run(
    `
        MATCH (school:School)
        WHERE id(school) = $id
        RETURN school
    `,
    { id: +id }
  );

  await session.close();
  await driver.close();

  return data.records[0].get("school").properties;
};

export default getSchool;
