import OrBlockData from "@typedefs/OrBlockData";
import React from "react";
import { Handle, Node, Position } from "react-flow-renderer";

const OrBlockNode = ({ data }: Node<OrBlockData>) => {
  return (
    <div className={`min-w-max py-3 px-6 bg-red-500 text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex flex-col items-center">
        <p>Or</p>
        <p>({Number(data.target).toFixed(2)} credits)</p>
      </div>
    </div>
  );
};

export default OrBlockNode;
