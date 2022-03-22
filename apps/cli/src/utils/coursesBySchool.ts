import Course from "types/Course";

/**
 * Query courses by semesters offered
 *
 * @param courses JSON object
 * @param school -> (String) the School's name ie: (UofT or UofG)
 * @returns Array of course objects
 */
const coursesBySchool = (courses: Course[], school: string) => {
    const courseJSON = courses;
    const results = courseJSON.filter((course) => { return course.school === school; });
    return results;
};

export default coursesBySchool;