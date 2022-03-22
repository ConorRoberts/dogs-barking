import Course from "types/Course";

/**
 * Query courses by course level.
 * @param courses: a list of course JSON objects.
 * @param desiredCourseLevel: The course level to search for.
 *
 * @returns: An array of courses.
 */
const gradCoursesOnly = (courses: Course[]): Course[] => {
    const filteredJSON = courses.filter((course) => course.courseNumber > 5000);
    return filteredJSON;
};

export default gradCoursesOnly;
