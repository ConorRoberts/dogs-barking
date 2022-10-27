import Course from "~/types/Course";
import Requirement from "~/types/Requirement";
import OrBlockData from "~/types/OrBlockData";
import { LinkIcon } from "./Icons";
import Link from "next/link";
import CreditRequirementData from "~/types/CreditRequirementData";
// import isRequirementMet from "~/utils/isRequirementMet";
// import { useAuthenticator } from "@aws-amplify/ui-react";

interface Props {
  requirement: Requirement;
  nodes: Record<string, Requirement>;
}

const RequirementCard = ({ nodes, requirement }: Props) => {
  // const { user } = useAuthenticator();
  const { label, id } = requirement;

  // const taken = isRequirementMet(requirement, user?.takenCourses);

  return (
    <div className="bg-white shadow-sm dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-3">
        <div className="flex justify-between gap-4 items-center">
          {label === "Course" && (
            <Link href={`/course/${id}`} className="flex gap-1 items-center primary-hover">
              <LinkIcon size={18} />
              <p className="font-medium">{(requirement as Course).code}</p>
            </Link>
          )}
          {label === "OrBlock" && (
            <p className="font-medium">{`Complete ${(requirement as OrBlockData).target} of:`}</p>
          )}
          {label === "CreditRequirement" && (
            <p className="font-medium">{`Acquire ${(requirement as CreditRequirementData).value.toFixed(
              2
            )} credits`}</p>
          )}
        </div>
        {label === "OrBlock" && (
          <>
            {(requirement as OrBlockData).requirements.length === 0 && <p>{requirement.note}</p>}
            <div className="grid grid-cols-2 gap-1 items-centerD">
              {(requirement as OrBlockData).requirements.map((e: string) => (
                <Link
                  href={`/course/${e}`}
                  key={`${id}-requirementcard-${e}`}
                  className="flex gap-1 items-center primary-hover"
                >
                  <LinkIcon size={18} />
                  <p className="p-1">{(nodes[e] as Course).code}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      {/* {user && (
        <div
          className={`${
            taken ? "bg-emerald-700" : "bg-rose-700"
          } px-0.5 text-sm flex gap-2 justify-center text-white items-center mt-auto`}
        >
          {taken ? (
            <>
              <p>Complete</p>
              <CheckIcon size={15} />
            </>
          ) : (
            <>
              <p>Incomplete</p>
              <CancelIcon size={15} />
            </>
          )}
        </div>
      )} */}
    </div>
  );
};

export default RequirementCard;
