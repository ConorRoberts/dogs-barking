import Course from "@dogs-barking/common/types/Course";
import { Handle, Node, Position } from "react-flow-renderer";
import getNodeColour from "@utils/getNodeColour";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "@redux/graph";
import Link from "next/link";

const CourseNode = (props: Node<Course>) => {
  const { data, id } = props;
  const dispatch = useDispatch();
  return (
    <div
      className={`min-w-max py-3 px-4 ${getNodeColour(data)} text-white rounded-md`}
      //onClick={() => dispatch(setSelectedNode(props))}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center gap-4 justify-between">
        <p>{data.id}</p>
      </div>
    </div>
  );
};

export default CourseNode;
