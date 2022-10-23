import OrBlockData from "~/types/OrBlockData";
import React from "react";
import { Handle, Position } from "react-flow-renderer";

const OrBlockNode = (props) => {
  const { type, target } = props.data as OrBlockData;

  return (
    <div className={`min-w-max py-3 px-6 bg-gray-500 text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex flex-col items-center">
        <p>{`Choose ${type === "credit" ? `${Number(target).toFixed(2)} Credits` : `${Number(target).toFixed(0)}`}`}</p>
      </div>
    </div>
  );
};

export default OrBlockNode;
