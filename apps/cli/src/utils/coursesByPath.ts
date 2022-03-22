import Course from "types/Course";
import coursesByCourseCode from "../coursesByCourseCode";
import coursesByPrerequisite from "../coursesByPrerequisite";

/**
 * Performs a "path search" of a course, its prerequisites and all courses requiring it
 * @param courses (The array of courses to search)
 * @param courseCode (the course code of the root course)
 * @returns (Courses[]) an array of courses that either require the root course or are prerequisites of the root course
 */
const coursesByPath = (courses: Course[], courseCode: string): Course[] => {
    //console.log(courses);
    const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
    const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);
    const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");
    let combinedPath: Course[] = [];
    const copyCourse = courses;
    const rootCourse = coursesByCourseCode(copyCourse, courseCode);
    const requiresRoot = coursesByPrerequisite(copyCourse, [courseCode]);
    const rootPrereqs = rootCourse[0].prerequisites.join(" ").match(combinedCourseRegex);
    if (rootPrereqs) {
        for (const rootPrq of rootPrereqs) {
            combinedPath = [...combinedPath, ...coursesByCourseCode(courses, rootPrq)];
        }
    }

    return Array.from(new Set([...combinedPath, ...requiresRoot, ...rootCourse]));
};
export default coursesByPath;
