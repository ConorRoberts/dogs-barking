import formatNodes from "./formatNodes";
import getPrerequisites from "./getPrerequisites";

/**
 * Generates the graph structure for some prerequisites
 * @param nodeId
 * @returns
 */
const createPrerequisiteGraph = async (nodeId: string) => {
  const nodes = [];
  try {
    const data = await getPrerequisites(nodeId);

    for (const records of data) {
      for (const rec of records) {
        let idx = 0;
        for (const pre of rec) {
          if (pre?.labels?.includes("School")) continue;
          if (!nodes.find((e) => e?.id === pre.identity.low)) {
            nodes.push({
              id: pre.identity.low.toString(),
              position: { x: 0, y: 0 },
              type: pre.labels[0].toLowerCase(),
              data: pre.properties,
            });
          }

          if (idx > 0 && !nodes.find((e) => e?.id === `${pre.identity.low}-${rec.at(idx - 1).identity.low}`)) {
            nodes.push({
              id: `${pre.identity.low}-${rec.at(idx - 1).identity.low}`,
              target: pre.identity.low.toString(),
              source: rec.at(idx - 1).identity.low.toString(),
            });
          }

          idx++;
        }
      }
    }

    return formatNodes(nodes);
  } catch (error) {
    // context.res.setHeader("location", "/error/404");
    console.error(error);
    return { nodes: [], edges: [] };
  }
};

export default createPrerequisiteGraph;
