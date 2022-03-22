import Course, { SemestersOffered } from "types/Course";

/**
 * Query courses by semesters offered
 *
 * @param courses JSON object
 * @param semester
 * @returns Array of course objects
 */
const coursesBySemester = (courses: Course[], semester: SemestersOffered[]) => {
    const courseJSON = courses;
    const coursesResult = courseJSON.filter((course) => {
        for (const s of semester) {
            return course.semestersOffered.includes(s);
        }
    });

    return coursesResult;
};

export default coursesBySemester;
