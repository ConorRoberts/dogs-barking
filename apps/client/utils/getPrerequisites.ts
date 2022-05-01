import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Given a course's nodeId, return its associated prerequisite tree
 * @param nodeId
 * @returns
 */
const getPrerequisites = async (id: string): Promise<any[]> => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const { records } = await session.run(
      `
        MATCH p=(course:Course)-[:REQUIRES*0..20]->(prereq)
        where course.id = $id
        return nodes(p)
      `,
      { id }
    );

    await session.close();
    await driver.close();

    return records;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getPrerequisites;
