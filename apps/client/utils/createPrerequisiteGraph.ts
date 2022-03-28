import formatNodes from "./formatNodes";

/**
 * Generates the graph structure for some prerequisites
 * @param nodeId
 * @returns
 */
const createPrerequisiteGraph = (data: any[], requiredCourses?: any[]) => {
  const nodes = [];
  const programSpecific = [];
  // build the set of required courses

  requiredCourses?.map((course) => programSpecific.push(course.get("nodes(q)")[1].properties.id));
  try {
    for (const records of data) {
      for (const rec of records) {
        let idx = 0;
        for (const pre of rec) {
          // Check if this entity is a school or something else we don't want to show
          if (pre?.labels?.includes("School")) continue;

          // Check if the node already exists. If not, add the node
          if (!nodes.find((e) => e?.id === pre.identity.low)) {
            nodes.push({
              id: pre.identity.low.toString(),
              position: { x: 0, y: 0 },
              type: pre.labels[0].toLowerCase(),
              data: pre.properties,
            });
          }

          // Check if the edge already exists or this is our principal node. Add edge otherwise.
          if (idx > 0 && !nodes.find((e) => e?.id === `${pre.identity.low}-${rec.at(idx - 1).identity.low}`)) {
            
            const style = requiredCourses?.length > 0 && programSpecific.includes(pre.properties.id) ? {stroke:"blue"} : {};
            nodes.push({
              id: `${pre.identity.low}-${rec.at(idx - 1).identity.low}`,
              target: pre.identity.low.toString(),
              source: rec.at(idx - 1).identity.low.toString(),
              animated: requiredCourses?.length > 0 && programSpecific.includes(pre.properties.id),
              style: style,
            });
          }

          idx++;
        }
      }
    }

    return formatNodes(nodes.filter((e) => e.type !== "program"));
  } catch (error) {
    console.error(error);
    return { nodes: [], edges: [] };
  }
};

export default createPrerequisiteGraph;
