import Course from "types/Course";
/**
 * @param  {Course} courseA
 * @param  {Course} courseB
 */
const compareCourseCode = (courseA: Course, courseB: Course) => {
    const courseCodeA = courseA.departmentCode + "*" + courseA.courseNumber;
    const courseCodeB = courseB.departmentCode + "*" + courseB.courseNumber;

    return courseCodeA.localeCompare(courseCodeB);
};

export default compareCourseCode;
