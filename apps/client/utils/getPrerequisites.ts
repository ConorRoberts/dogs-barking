import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Given a course code, return its associated prerequisite tree
 * @param courseCode
 * @returns
 */
const getPrerequisites = async (nodeId: string): Promise<any[]> => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const data = await session.run(
      `
        MATCH p=(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
        where id(course) = ${nodeId}
        return nodes(p)
      `,
      { nodeId: +nodeId }
    );

    await session.close();
    await driver.close();

    return data.records;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getPrerequisites;
