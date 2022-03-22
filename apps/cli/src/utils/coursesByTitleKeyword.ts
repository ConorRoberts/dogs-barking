import Course from "types/Course";

/**
 * Query courses by keyword in the course title.
 *
 * @param courses: a list of course JSON objects.
 * @param desiredDepartmentCode: The department code to search for.
 * @returns: An array of courses.
 */
const coursesByTitleKeyword = (courses: Course[], keyword: string): Course[] => {
    keyword = keyword.toLowerCase();
    const filteredJSON = courses.filter((course) => course.courseName.toLowerCase().includes(keyword));
    return filteredJSON;
};

export default coursesByTitleKeyword;
