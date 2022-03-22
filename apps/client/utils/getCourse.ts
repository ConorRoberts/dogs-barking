import Course from "@dogs-barking/common/types/Course";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Grab course from DB and return it
 * @param courseCode
 */
const getCourse = async (nodeId: string): Promise<Course | null> => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();

    const result = await session.run(
      `
        MATCH(course:Course)
        where id(course) = $nodeId 
        return course
      `,
      { nodeId: +nodeId }
    );

    await session.close();
    await driver.close();

    return { ...result.records[0].get("course").properties, nodeId };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getCourse;
