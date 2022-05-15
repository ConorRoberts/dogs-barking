import Course from "@typedefs/Course";
import Program from "@typedefs/Program";
import { Edge, Node } from "react-flow-renderer";
import formatNodes from "./formatNodes";

interface Config {
  type: "Program" | "Course";
}

/**
 * Generates the graph structure for some prerequisites
 * @param nodeId
 * @returns
 */
const createPrerequisiteGraph = (origin: Course | Program, config?: Config) => {
  const nodes: (Node | Edge)[] = [
    {
      id: origin.id,
      position: { x: 0, y: 0 },
      type: config.type ?? "Course",
      data: origin,
    },
  ];

  try {
    const populate = (parent) => {
      parent.requirements.forEach((e) => {
        // Check if the node already exists. If not, add the node
        if (!nodes.find((n) => n?.id === e.id)) {
          nodes.push({
            id: e.id,
            position: { x: 0, y: 0 },
            type: e.type,
            data: e,
          });
        }

        // Check if the edge already exists or this is our principal node. Add edge otherwise.
        if (!nodes.find((n) => n?.id === `${parent.id}-${e.id}`)) {
          nodes.push({
            id: `${parent.id}-${e.id}`,
            position: { x: 0, y: 0 },
            source: parent.id,
            target: e.id,
          });
        }

        populate(e);
      });
    };

    populate(origin);

    return formatNodes(nodes);
  } catch (error) {
    console.error(`[createPrerequisiteGraph (origin: ${origin.id})]: ${error}`);
    return { nodes: [], edges: [] };
  }
};

export default createPrerequisiteGraph;
