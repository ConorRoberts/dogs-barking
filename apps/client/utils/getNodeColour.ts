import Course from "@dogs-barking/common/types/Course";

/**
 * Grabs a unique colour for a node based on the course code
 * @param  {Course} course
 */
const getNodeColour = (course: Course) => {
  const { number } = course;
  const char = number?.toString().charAt(0);
  if (char >= "8") {
    return "bg-indigo-600";
  } else if (char === "7") {
    return "bg-orange-900";
  } else if (char === "6") {
    return "bg-emerald-600";
  } else if (char === "5") {
    return "bg-cyan-600";
  } else if (char === "4") {
    return "bg-green-600";
  } else if (char === "3") {
    return "bg-yellow-600";
  } else if (char === "2") {
    return "bg-blue-600";
  } else if (char === "1") {
    return "bg-gray-600";
  } else {
    return "bg-gray-600";
  }
};

export default getNodeColour;
