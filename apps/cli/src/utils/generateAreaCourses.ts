import Section from "types/Section";
import Course, { CourseIndex } from "types/Course";

/**
 * Takes an area, returns the courses in array format
 * @param area An area object containing courses from an Area of Emphasis/Area of Concentration 
 * @param courses An object containing all the course objects 
 * @returns An array of all course objects pertaining to the area
 */
const generateAreaCourses = (area: Section, courses: CourseIndex, semester?: string): Course[] => {
    const courseArr: Course[] = [];
    const areaCourses = area?.courses;

    for (const are of areaCourses) {
        const tmp = are.course;
        let checkSem = 0;
        if (tmp?.includes("/")) {
            // split /'s in the or case
            const orCourses = tmp.split(" / ");
            orCourses.forEach((e) => {
                if (!semester) return;
                semester ? checkSem = 1 : courseArr.push(courses[e]);
                if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                    if (!courses[e]) return;
                    courseArr.push(courses[e]);
                }
            });
        } else if (tmp) {
            semester ? checkSem = 1 : courseArr.push(courses[tmp]);
            if (!semester) continue;
            if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                if (!courses[tmp]) continue;
                courseArr.push(courses[tmp]);
            }
        }
    }

    return courseArr;
};

export default generateAreaCourses;
