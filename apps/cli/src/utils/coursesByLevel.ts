import Course from "types/Course";

/**
 * Query courses by course level.
 * @param courses: a list of course JSON objects.
 * @param desiredCourseLevel: The course level to search for.
 *
 * @returns: An array of courses.
 */
const coursesByLevel = (courses: Course[], desiredCourseLevel: number): Course[] => {
    const filteredJSON = courses.filter(
        (course) => String(course.courseNumber).charAt(0) === String(desiredCourseLevel).charAt(0)
    );
    return filteredJSON;
};

export default coursesByLevel;
