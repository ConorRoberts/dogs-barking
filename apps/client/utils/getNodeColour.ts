import Course from "~/types/Course";

/**
 * Grabs a unique colour for a node based on the course code
 * @param  {Course} course
 */
const getNodeColour = (course: Course) => {
  const { number } = course;
  const char = number?.toString().charAt(0);
  if (char >= "5") {
    return "bg-violet-600";
  } else if (char === "4") {
    return "bg-cyan-600";
  } else if (char === "3") {
    return "bg-blue-600";
  } else if (char === "2") {
    return "bg-emerald-600";
  } else if (char === "1") {
    return "bg-green-600";
  } else {
    return "bg-gray-600";
  }
};

export default getNodeColour;
