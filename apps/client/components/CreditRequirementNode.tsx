import { Handle, Node, Position } from "react-flow-renderer";

const CourseNode = (props: Node<any>) => {
  const { data, id } = props;

  return (
    <div className={`min-w-max py-3 px-4 text-white rounded-md bg-purple-500`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center gap-4 justify-between">
        <p>CreditRequirement</p>
      </div>
    </div>
  );
};

export default CourseNode;
