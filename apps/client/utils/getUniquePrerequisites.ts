import getNeo4jDriver from "./getNeo4jDriver";

const getUniquePrerequisites = async (nodeId: string) => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
    const data = await session.run(
      `
            MATCH p=(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
            where id(course) = ${nodeId}
            return nodes(p) as nodes
          `,
      { nodeId: +nodeId }
    );

    await session.close();
    await driver.close();

    const result = [];

    data.records.forEach((record) => {
      record.get("nodes").forEach((node) => {
        const newNode = { id: node.properties.id, nodeId: node.identity.low.toString() };

        if (
          !result.find((n) => n.nodeId === newNode.nodeId) &&
          node.properties?.name !== undefined &&
          newNode.nodeId !== nodeId
        )
          result.push(newNode);
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getUniquePrerequisites;
