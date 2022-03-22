import Course from "types/Course";
/**
 * Query courses by departmentCode.
 *
 * @param courses: a list of course JSON objects.
 * @param desiredDepartmentCode: The department code to search for.
 * @returns: An array of courses.
 */
const coursesByDepartmentCode = (courses: Course[], desiredDepartmentCode: string): Course[] => {
    const filteredJSON = courses.filter((course) => course.departmentCode === desiredDepartmentCode);
    return filteredJSON;
};

export default coursesByDepartmentCode;
