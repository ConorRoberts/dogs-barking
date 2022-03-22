import Course from "types/Course";
import { Query } from "types/Input";
import coursesByCourseCode from "../coursesByCourseCode";
import coursesByCourseNumber from "../coursesByCourseNumber";
import coursesByCredits from "../coursesByCredits";
import coursesByDepartmentCode from "../coursesByDepartmentCode";
import coursesByLevel from "../coursesByLevel";
import coursesByPath from "../coursesByPath";
import coursesByPrerequisite from "../coursesByPrerequisite";
import coursesBySchool from "../coursesBySchool";
import coursesBySemester from "../coursesBySemester";
import coursesByTitleKeyword from "../coursesByTitleKeyword";

/* Regexes for data processing */
/* course code regex
 * ie: CIS*1300, MGMT*1000
 */
const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);

const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");

/**
 * Executes queries based on parsed properties
 * @param queries (Map) -> Stores query types : search parameters
 * @param courses  (Course[]) Array of course data structure
 * @param searchParams ()
 * @returns
 */
const executeQuery = (queries: Query, courses: Course[]): Course[] => {
    let resultSet: Course[] = [];

    let tmpSet: Course[] = courses;

    //tmpSet = Object.values(testJSON);
    if (queries.semester.length > 0) {
        // semesters exist
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesBySemester(tmpSet, queries.semester);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.path === true) {
        // path search (graph specific)
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByPath(tmpSet, queries.coursecode);
        tmpSet = [...tmpSet, ...resultSet];
    } else if (combinedCourseRegex.test(queries.coursecode)) {
        // course code satisifes regex
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByCourseCode(tmpSet, queries.coursecode);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.department.match(/([A-Z]{3})|([A-Z]{4})/)) {
        // valid department code
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByDepartmentCode(tmpSet, queries.department);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.prerequisite.length > 0) {
        // valid prereq criteria
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByPrerequisite(tmpSet, queries.prerequisite);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.coursenum > -1) {
        // course number exists
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByCourseNumber(tmpSet, queries.coursenum);
        tmpSet = [...tmpSet, ...resultSet];
    }

    if (queries.coursecode !== "" && queries.path === false) {
        // course code exists
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByCourseCode(tmpSet, queries.coursecode);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.title.length > 0) {
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByTitleKeyword(tmpSet, queries.title[0]);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.weight !== -1) {
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByCredits(tmpSet, queries.weight);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.level > -1) {
        // level exists
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesByLevel(tmpSet, queries.level);
        tmpSet = [...tmpSet, ...resultSet];
    }
    if (queries.school !== "") {
        // filter by school
        console.log(queries.school);
        resultSet.length > 0 ? (tmpSet = resultSet) : (tmpSet = courses);
        resultSet = coursesBySchool(tmpSet, queries.school);
        tmpSet = [...tmpSet, ...resultSet];
    }
    return Array.from(new Set(resultSet));
};
export default executeQuery;
