import { useAuthenticator } from "@aws-amplify/ui-react";
import { PlannerState } from "@redux/planner";
import { RootState } from "@redux/store";
import Course from "@typedefs/Course";
import CreditRequirementData from "@typedefs/CreditRequirementData";
import OrBlockData from "@typedefs/OrBlockData";
import Requirement from "@typedefs/Requirement";
import isRequirementMet from "@utils/isRequirementMet";
import Link from "next/link";
import { useSelector } from "react-redux";
import { CancelIcon, CheckIcon, LinkIcon } from "./Icons";

interface Props {
  requirement: Requirement;
}

const PlannerSidebarRequirement = ({ requirement }: Props) => {
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const { label, id } = requirement;
  const { user } = useAuthenticator();

  // const plannedCourses = plan?.semesters
  //   ?.map((e) => e.courses)
  //   .flat()
  //   .concat(...user.takenCourses);
  // const taken = isRequirementMet(requirement, plannedCourses);

  return (
    <div className="rounded-xl overflow-hidden flex justify-between py-1">
      <div>
        <div className="flex justify-between gap-4 items-center">
          {label === "Course" && (
            <Link href={`/course/${id}`} passHref>
              <div className="flex gap-1 items-center primary-hover">
                <LinkIcon size={18} />
                <p className="font-medium">{(requirement as Course).code}</p>
              </div>
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
          <div className="grid grid-cols-2 gap-1 items-center">
            {(requirement as OrBlockData).requirements.map((e: Course) => (
              <Link href={`/course/${e.id}`} key={`${id}-requirementcard-${e.id}`} passHref>
                <div className="flex gap-1 items-center primary-hover">
                  <LinkIcon size={18} />
                  <p className="p-1">{e.code}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {label === "OrBlock" && (
          <div className="grid grid-cols-2 gap-1 items-center">{(requirement as OrBlockData).note}</div>
        )}
      </div>
      {/* <div
        className={`${
          taken ? "text-emerald-500" : "text-rose-500"
        } w-6 h-6 text-sm flex gap-2 justify-center text-white items-center bg-white dark:bg-gray-800 dark:bg-grrounded-full text-center rounded-full shrink-0`}
      >
        {taken ? <CheckIcon size={15} /> : <CancelIcon size={15} />}
      </div> */}
    </div>
  );
};

export default PlannerSidebarRequirement;
