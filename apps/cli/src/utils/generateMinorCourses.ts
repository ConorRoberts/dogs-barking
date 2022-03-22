import Section from "types/Section";
import Course, { CourseIndex } from "types/Course";

const generateMinorCourses = (minor: Section, courses: CourseIndex, semester?: string): Course[] => {
    const courseArr: Course[] = [];
    const minorCourses = minor?.courses;

    if (minorCourses) {
        for (const are of minorCourses) {
            let checkSem = 0;
            if (are.course?.includes("/")) {
                const orCourse = are.course.split(" / ");
                for (const course of orCourse) {
                    semester ? checkSem = 1 : courseArr.push(courses[course]);
                    if (!semester) continue;
                    if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                        if (!courses[course]) continue;
                        courseArr.push(courses[course]);
                    }
                }
            } else {
                const tmp = are.course;
                if (!tmp) continue;
                semester ? checkSem = 1 : courseArr.push(courses[tmp]);
                if (!semester) continue;
                if (checkSem && (are.section?.includes(semester) || are.subsection?.includes(semester))) {
                    if (!courses[tmp]) continue;
                    courseArr.push(courses[tmp]);
                }
            }
        }
    }

    return courseArr;
};

export default generateMinorCourses;
