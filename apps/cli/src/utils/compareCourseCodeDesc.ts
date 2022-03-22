import Course from "types/Course";
/**
 * Compares two given courses by their course code. Course code is a string of the form "DEPT*NUMBER".
 * @param  {Course} courseA
 * @param  {Course} courseB
 */
const compareCourseCodeDesc = (courseA: Course, courseB: Course) => {
    const courseCodeA = courseA.departmentCode + "*" + courseA.courseNumber;
    const courseCodeB = courseB.departmentCode + "*" + courseB.courseNumber;

    return courseCodeB.localeCompare(courseCodeA);
};

export default compareCourseCodeDesc;
