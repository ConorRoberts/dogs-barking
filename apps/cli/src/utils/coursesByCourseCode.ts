import Course from "types/Course";

/**
 * Query courses by course code
 * .
 * @param courses: a list of course JSON objects.
 * @param searchString: The course code string to search for. (e.g. CIS*1000)
 * @returns: An array of courses.
 */
const coursesByCourseCode = (courses: Course[], searchString: string): Course[] => {
    const params = searchString.split("*");
    const filteredJSON = courses.filter(
        (course) => course.courseNumber === +params[1] && course.departmentCode === params[0]
    );

    return filteredJSON;
};

export default coursesByCourseCode;
