import getNeo4jDriver from "./getNeo4jDriver";

const getUniquePrerequisites = async (nodeId: string) => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const data = await session.run(
      `
      MATCH (course:Course)-[:HAS_PREREQUISITE]->(prereq:Course)
      where id(course) = ${nodeId}
      return collect({id: prereq.id, nodeId: id(prereq)}) as prereqs

      UNION ALL

      MATCH (course:Course)-[:HAS_PREREQUISITE]->(prereq:PrerequisiteBlock)-[:OR]->(prereqCourse:Course)
      where id(course) = ${nodeId}
      return collect({id: prereqCourse.id, nodeId: id(prereqCourse)}) as prereqs

      `,
      { nodeId: +nodeId }
    );

    await session.close();
    await driver.close();

    return data.records.map((e) => e.get("prereqs").map((node) => ({ ...node, nodeId: node.nodeId.low })));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getUniquePrerequisites;
