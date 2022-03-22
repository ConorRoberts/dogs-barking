import Section from "types/Section";
import Course, { CourseIndex } from "types/Course";

/**
 * Takes a major, returns the courses in array format
 * @param {Section} major A section object containing information of a major 
 * @param {CourseIndex} courses An object of all courses
 * @returns Returns an array of course objects pertaining to the major
 */
const generateMajorCourses = (major: Section, courses: CourseIndex, school:string, semester? : string, ): Course[] => {
    const courseArr: Course[] = [];
    const majorCourses = major?.courses;

    if (majorCourses) {
        for (const are of majorCourses) {
            let checkSem = 0;
            if (are.course?.includes("/")) {
                const courseSplit = are.course.split(" / ");
                for (let course of courseSplit) {
                    if (school === "uoft") {
                        course = course.substring(0, course.length - 2);
                    }
                    //console.log(course.substring(0, course.length - 2));
                    semester ? checkSem = 1 : courseArr.push(courses[course]);
                    if (!semester) continue;
                    if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                        if (!courses[course]) continue;
                        courseArr.push(courses[course]);
                    }
                }
            } else {
                let tmp = are.course;
                if (!tmp) continue;
                if (school === "uoft") {
                    tmp = tmp.substring(0, tmp.length -2);
                }
                //console.log(tmp.substring(0, tmp.length -2));
                semester ? checkSem = 1 : courseArr.push(courses[tmp]);
                if (!semester) continue;
                if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                    if (!courses[tmp]) continue;
                    tmp ? courseArr.push(courses[tmp]) : null;
                }
            }
        }
    }

    return courseArr;
};

export default generateMajorCourses;
