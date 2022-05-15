import Course from "@typedefs/Course";
import OrBlockData from "@typedefs/OrBlockData";
import Program from "@typedefs/Program";
import Requirement from "@typedefs/Requirement";

interface Props {
  parent: Program | Course;
}

const RequirementsList = ({ parent }: Props) => {
  return (
    <div className="rounded-xl border border-gray-500 dark:border-gray-600">
      <div className="p-4">
        <h2 className="text-xl font-bold">Requirements</h2>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-gray-600">
        {parent.requirements.map((requirement, index) => (
          <div key={`${parent.id}-requirement-${index}`} className="flex flex-col p-4">
            <p>{requirement.label === "OrBlock" && `Select ${(requirement as OrBlockData).target}`}</p>
            <p>{requirement.label === "Course" && (requirement as Course).code}</p>
            {requirement.requirements.length > 0 && (
              <SubrequirementsList parent={requirement} type={requirement.label} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface SubrequirementProps {
  parent: Requirement;
  type: string;
}
const SubrequirementsList = ({ parent }: SubrequirementProps) => {
  return (
    <div className="px-8">
      {parent.requirements.map((requirement, index) => (
        <div key={index} className="flex flex-col">
          <p>{requirement.label === "Course" && (requirement as Course).code}</p>
          <p>
            {requirement.label === "OrBlock" &&
              `Choose ${
                (requirement as OrBlockData).type === "credit"
                  ? `${Number((requirement as OrBlockData).target).toFixed(2)} Credits`
                  : `${Number((requirement as OrBlockData).target).toFixed(0)}`
              }`}
          </p>
          <SubrequirementsList parent={requirement} type={requirement.label} />
        </div>
      ))}
    </div>
  );
};

export default RequirementsList;
