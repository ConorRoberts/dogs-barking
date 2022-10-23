import Course from "~/types/Course";
import CreditRequirementData from "~/types/CreditRequirementData";
import OrBlockData from "~/types/OrBlockData";
import Requirement from "~/types/Requirement";

/**
 * @param requirement The requirement in question
 * @param taken List of requirements already met
 * @returns Whether or not the requirement is met
 */
const isRequirementMet = (requirement: Requirement, taken: Requirement[] = []) => {
  if (!requirement) return false;

  const { id, label } = requirement;
  if (label === "Course") {
    // This is a course and the user has taken this course
    return taken.some((e) => e.id === id);
  } else if (label === "OrBlock") {
    const block = requirement as OrBlockData;
    if (block?.type === "course") {
      // The user has taken target number of courses
      return block.requirements.filter((e) => taken.some((e2) => e2.id === e.id)).length === block.target;
    } else if (block.type === "credit") {
      // The user has taken target number of credits
      return (
        block.requirements
          .filter((e) => taken.some((e2) => e2.id === e.id))
          .reduce((a, b: Course) => a + b.credits, 0) >= block.target
      );
    }
  } else if (label === "CreditRequirement") {
    const block = requirement as CreditRequirementData;
    return taken.reduce((a, b: Course) => a + b.credits, 0) >= block.value;
  }

  return false;
};

export default isRequirementMet;
