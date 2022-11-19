import Course from "~/types/Course";
import Program from "~/types/Program";
import Requirement from "~/types/Requirement";
import { Edge, Node } from "react-flow-renderer";
import formatNodes from "./formatNodes";

interface Config {
  type?: "Program" | "Course";
}

const requirementKeys = {
  Program: "major",
  Course: "requirements",
};

/**
 * Generates the graph structure for some prerequisites
 * @param nodeId
 * @returns
 */
const createPrerequisiteGraph = (
  origin: Course | Program,
  requirements: Record<string, Requirement>,
  config: Config
) => {
  const nodes: (Node | Edge)[] = [
    {
      id: origin.id,
      position: { x: 0, y: 0 },
      type: config?.type ?? "Course",
      data: origin,
    },
  ];

  try {
    const populate = (parent, requirementIds: string[]) => {
      requirementIds.forEach((e: string) => {
        const req = requirements[e];
        // Check if the node already exists. If not, add the node
        if (!nodes.some((n) => n?.id === e)) {
          nodes.push({
            id: req.id,
            position: { x: 0, y: 0 },
            type: req.label,
            data: req,
          });
        }

        // Check if the edge already exists or this is our principal node. Add edge otherwise.
        if (!nodes.some((n) => n?.id === `${parent.id}-${e}`)) {
          nodes.push({
            id: `${parent.id}-${e}`,
            position: { x: 0, y: 0 },
            source: parent.id,
            target: e,
          });
        }


        if ("requirements" in req){
          populate(req, req.requirements);
        }
      });
    };

    populate(origin, origin[requirementKeys[config.type]]);

    return formatNodes(nodes);
  } catch (error) {
    console.error(`[createPrerequisiteGraph (origin: ${origin.id})]: ${error}`);
    return { nodes: [], edges: [] };
  }
};

export default createPrerequisiteGraph;
