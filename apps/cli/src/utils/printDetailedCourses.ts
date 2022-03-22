import Course from "types/Course";

/**
 * Prints the information of the courses from the provided list, in detailed format
 * @param  {Course[]} courses List of courses
 */
const printDetailedCourses = (courses: Course[]) => {
    let i = 0;
    for (const c of courses) {
        i += 1;
        const courseCode = c.departmentCode + "*" + c.courseNumber;
        console.log(
            i +
                ". " +
                "(" +
                courseCode +
                ") " +
                "\n" +
                "\t Course Name - " +
                c.courseName +
                "\n" +
                "\t Department Code - " +
                c.departmentCode +
                "\n" +
                "\t Semesters Offered - " +
                c.semestersOffered +
                "\n" +
                "\t Credit Weight - " +
                c.creditWeight +
                "\n" +
                "\t Locations - " +
                c.location +
                "\n" +
                "\t Prerequisites - " +
                c.prerequisites +
                "\n" +
                "\t Corequisites - " +
                c.corequisites +
                "\n" +
                "\t Lectures Per Week - " +
                c.lecturesPerWeek +
                "\n" +
                "\t Labs Per Week - " +
                c.labsPerWeek +
                "\n" +
                "\t Equates - " +
                c.equates +
                "\n" +
                "\t Restrictions - " +
                c.restrictions +
                "\n" +
                "\t Associated Departments - " +
                c.associatedDepartments +
                "\n" +
                "\t YearsOffered - " +
                c.yearsOffered
        );
    }
    console.log("\nTotal Courses: " + i);
};

export default printDetailedCourses;
