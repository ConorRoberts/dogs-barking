import Course from "@dogs-barking/common/types/Course";
import getCourse from "./getCourse";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Grabs a random course based on a random index
 * @returns Course
 */
const getRandomCourse = async (): Promise<Course> => {
  const driver = getNeo4jDriver();
  const session = driver.session();

  const { records } = await session.run(`
        MATCH (course:Course)
        RETURN properties(course) as course, rand() as n, id(course)
        ORDER BY n
        LIMIT (1)
    `);

  await session.close();
  await driver.close();

  return await getCourse(records[0].get("course").id);
};

export default getRandomCourse;
