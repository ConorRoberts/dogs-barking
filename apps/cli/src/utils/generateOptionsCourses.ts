import Option from "types/Option";
import Course, { CourseIndex } from "types/Course";

/**
 * Takes a set of options, returns the courses in array format
 * @param options
 * @param courses
 * @returns
 */
const generateOptionsCourses = (options: Option, courses: CourseIndex): Course[] => {
    const optionsArr: Course[] = [];
    const optionCourseCodes = options.courses;

    if (optionCourseCodes) {
        for (const opt of optionCourseCodes) {
            if (!courses[opt]) continue;
            optionsArr.push(courses[opt]);
        }
    }

    return optionsArr;
};

export default generateOptionsCourses;
