import Course from "@typedefs/Course";
import Requirement from "@typedefs/Requirement";
import OrBlockData from "@typedefs/OrBlockData";
import { CancelIcon, CheckIcon } from "./Icons";
import Link from "next/link";

interface Props {
  requirement: Requirement;
}

const RequirementCard = ({ requirement }: Props) => {
  const taken = false;
  return (
    <div className="bg-white shadow-sm dark:bg-gray-800 rounded-xl p-3">
      <div className="flex justify-between gap-4 items-center">
        {requirement.label === "Course" && (
          <Link href={`/course/${requirement.id}`} passHref>
            <p className="font-medium primary-hover">{(requirement as Course).code}</p>
          </Link>
        )}
        {requirement.label === "OrBlock" && (
          <p className="font-medium">{`Select ${(requirement as OrBlockData).target}`}</p>
        )}
        <div>
          {taken ? (
            <CheckIcon size={20} className="text-emerald-300" />
          ) : (
            <CancelIcon size={20} className="text-rose-400" />
          )}
        </div>
      </div>
      {requirement.label === "OrBlock" && (
        <div className="flex gap-1 items-center">
          {requirement.requirements.map((e: Course) => (
            <Link href={`/course/${e.id}`} key={`${requirement.id}-requirementcard-${e.id}`} passHref>
              <p className="p-1 primary-hover">{e.code}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequirementCard;
