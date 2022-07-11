import ReactFlow, {
  Node,
  ReactFlowProvider,
  Background,
  Edge,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import nodeTypes from "@config/nodeTypes";
import { useEffect } from "react";

type CourseGraphProps = {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
};

const CourseGraph = ({ nodes: initialNodes, edges: initialEdges, height }: CourseGraphProps) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setEdges, setNodes]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative overflow-hidden h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl"
        style={{
          height: `${height ?? 600}px`,
        }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            onEdgesChange={() => setEdges([...edges])}
            onNodesChange={() => setNodes([...nodes])}
            minZoom={0}
            maxZoom={4}
            fitView
          />
          <Background />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default CourseGraph;
