import Course from "types/Course";

/**
 * Query courses by course number.
 * @param courses: a list of course JSON objects.
 * @param desiredCourseNumber: The department code to search for.
 *
 * @returns: An array of courses.
 */
const coursesByCourseNumber = (courses: Course[], desiredCourseNumber: number): Course[] => {
    const filteredJSON = courses.filter((course) => course.courseNumber === desiredCourseNumber);
    return filteredJSON;
};

export default coursesByCourseNumber;
