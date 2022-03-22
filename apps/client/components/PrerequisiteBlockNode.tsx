import React from "react";
import { Handle, Position } from "react-flow-renderer";

const PrerequisiteBlockNode = ({ data, id }) => {
  return (
    <div className={`min-w-max py-3 px-6 bg-red-500 text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <p>OR</p>
    </div>
  );
};

export default PrerequisiteBlockNode;
