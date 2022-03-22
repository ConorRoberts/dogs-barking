import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Grabs a random course based on a random index
 * @returns Course
 */
const getRandomCourse = async (): Promise<number> => {

  const driver = getNeo4jDriver();
  const session = driver.session();

  const data = await session.run(`
        MATCH (course:Course)
        RETURN course, rand() as n, id(course)
        ORDER BY n
        LIMIT (1)
    `);

  await session.close();
  await driver.close();

  return data.records[0].get("course").identity.low;
};

export default getRandomCourse;
