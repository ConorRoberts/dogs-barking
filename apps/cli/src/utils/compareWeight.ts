import Course from "types/Course";
/**
 * @param  {Course} courseA
 * @param  {Course} courseB
 */
const compareWeight = (courseA: Course, courseB: Course) => {
    return courseA.creditWeight - courseB.creditWeight;
};

export default compareWeight;
