import Course from "types/Course";

/**
 * Prints the information of the courses from the provided list
 * @param  {Course[]} courses List of courses
 */
const printCourses = (courses: Course[]) => {
    let i = 0;
    for (const c of courses) {
        i += 1;
        const courseCode = c.departmentCode + "*" + c.courseNumber;
        console.log(
            i + ". " + "(" + courseCode + ") " + c.courseName + " - " + c.creditWeight + " [" + c.semestersOffered + "]"
        );
    }
    console.log("\nTotal Courses: " + i);
    return;
};

export default printCourses;
