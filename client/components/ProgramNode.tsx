import Program from "@typedefs/Program";
import { Handle, Position } from "react-flow-renderer";

const ProgramNode = (props) => {
  const { name } = props.data as Program;

  return (
    <div className={`min-w-max py-3 px-4 bg-purple-500 text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center flex-col">
        <p>{name}</p>
        <p className="text-gray-200 text-xs">Program</p>
      </div>
    </div>
  );
};

export default ProgramNode;
