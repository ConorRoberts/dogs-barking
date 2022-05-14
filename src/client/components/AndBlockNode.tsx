import Course from "@typedefs/Course";
import { Handle, Node, Position } from "react-flow-renderer";
import getNodeColour from "@utils/getNodeColour";

const AndBlockNode = (props) => {
  const { data, id } = props;

  return (
    <div className={`min-w-max py-3 px-4 ${getNodeColour(data)} text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center gap-4 justify-between">
        <p>AndBlock</p>
      </div>
    </div>
  );
};

export default AndBlockNode;
