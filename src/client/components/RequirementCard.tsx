import Course from "@typedefs/Course";
import Requirement from "@typedefs/Requirement";
import OrBlockData from "@typedefs/OrBlockData";
import { CancelIcon, CheckIcon, LinkIcon } from "./Icons";
import Link from "next/link";
import { RootState } from "@redux/store";
import { AuthState } from "@redux/auth";
import { useSelector } from "react-redux";
import CreditRequirementData from "@typedefs/CreditRequirementData";
import isRequirementMet from "@utils/isRequirementMet";

interface Props {
  requirement: Requirement;
}

const RequirementCard = ({ requirement }: Props) => {
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const { label, id } = requirement;

  const taken = isRequirementMet(requirement, user?.takenCourses);

  return (
    <div className="bg-white shadow-sm dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-3">
        <div className="flex justify-between gap-4 items-center">
          {label === "Course" && (
            <Link href={`/course/${id}`} passHref>
              <a className="flex gap-1 items-center primary-hover">
                <LinkIcon size={18} />
                <p className="font-medium">{(requirement as Course).code}</p>
              </a>
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
          <div className="grid grid-cols-2 gap-1 items-centerD">
            {(requirement as OrBlockData).requirements.map((e: Course) => (
              <Link href={`/course/${e.id}`} key={`${id}-requirementcard-${e.id}`} passHref>
                <a className="flex gap-1 items-center primary-hover">
                  <LinkIcon size={18} />
                  <p className="p-1">{e.code}</p>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
      {user && (
        <div
          className={`${
            taken ? "bg-emerald-700" : "bg-rose-700"
          } px-0.5 text-sm flex gap-2 justify-center text-white items-center mt-auto`}>
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
      )}
    </div>
  );
};

export default RequirementCard;
