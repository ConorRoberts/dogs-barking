import Course from "~/types/Course";
import { Handle, Position } from "reactflow";
import getNodeColour from "~/utils/getNodeColour";

const CourseNode = (props) => {
  const { code } = props.data as Course;

  return (
    <div className={`min-w-max py-3 px-4 ${getNodeColour(props.data)} text-white rounded-md`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center flex-col">
        <p>{code}</p>
        <p className="text-gray-200 text-xs">Course</p>
      </div>
    </div>
  );
};

export default CourseNode;
