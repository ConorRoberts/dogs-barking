import { Edge, isNode, Node } from "reactflow";
import dagre from "dagre";

const formatNodes = (nodes: (Node | Edge)[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 150;
  const nodeHeight = 100;

  const direction = "TB";
  dagreGraph.setGraph({ rankdir: direction });

  const elements = [...nodes];

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  const result = elements.map((e: Node) => {
    const el = { ...e };
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });

  return { nodes: result.filter((e) => isNode(e)), edges: result.filter((e) => !isNode(e)) };
};

export default formatNodes;
