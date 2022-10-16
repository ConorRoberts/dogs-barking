import CreditRequirementData from "~/types/CreditRequirementData";
import { Handle, Position } from "react-flow-renderer";

const CourseNode = (props) => {
  const data = props.data as CreditRequirementData;

  return (
    <div className={`min-w-max py-3 px-4 text-white rounded-md bg-purple-500`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex flex-col items-center">
        <p>CreditRequirement</p>
        <p>({Number(data.value).toFixed(2)} credits)</p>
      </div>
    </div>
  );
};

export default CourseNode;
