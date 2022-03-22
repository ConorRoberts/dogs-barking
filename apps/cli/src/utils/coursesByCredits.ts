import Course from "types/Course";

/**
 * Query courses by credits
 *
 * @param courses JSON object
 * @param credits
 * @returns Array of course objects
 */
const coursesByCredits = (courses: Course[], credits: number) => {
    const courseJSON = courses;
    const coursesResult = courseJSON.filter((course) => {
        return course.creditWeight === credits;
    });

    return coursesResult;
};

export default coursesByCredits;
