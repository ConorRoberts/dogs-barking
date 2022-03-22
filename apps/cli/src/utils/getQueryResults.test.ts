import getQueryResults from ".";
import Course from "types/Course";
import parseInput from "cli-utils/parseInput";
import { Query } from "types/Input";
import executeQuery from "query-utils/executeQuery";
import compareCourseCode from "query-utils/compareCourseCode";

import courses from "data/courses";
const departmentCourses = Object.values(courses).filter((course) => course.departmentCode === "CIS");

//tests weight flag
test("-w flag", () => {
    const input = parseInput("query -dpt CIS -w");
    const expectedOutput = departmentCourses.sort((a, b) => a.creditWeight - b.creditWeight);
    expect(getQueryResults(input, courses, input.QueryTypes.options)).toStrictEqual(expectedOutput);
});

//tests description flag
test("query -dpt CIS -desc", () => {
    const input = parseInput("query -dpt CIS -desc");
    const expectedOutput = departmentCourses.sort((a, b) => b.courseNumber - a.courseNumber);
    const queryResult = getQueryResults(input, courses, input.QueryTypes.options);

    expect(queryResult).toStrictEqual(expectedOutput);
});

//tests undergraduate flag
test("-u flag", () => {
    const input = parseInput("query -dpt CIS -u");
    const queryTypes: Query = input.QueryTypes;
    //console.log(queryTypes.get('prerequisite'))
    const results = executeQuery(queryTypes, Object.values(courses)) as Course[];

    const expectedOutput = results.filter((c) => c.courseNumber <= 5000);
    const queryResult = getQueryResults(input, courses, input.QueryTypes.options);

    expect(queryResult).toStrictEqual(expectedOutput);
});

//tests graduate flag
test("-g flag", () => {
    const input = parseInput("query -dpt CIS -g");
    const queryTypes: Query = input.QueryTypes;
    //console.log(queryTypes.get('prerequisite'))
    const results = executeQuery(queryTypes, Object.values(courses)) as Course[];

    const expectedOutput = results.filter((c) => c.courseNumber > 5000);
    const queryResult = getQueryResults(input, courses, input.QueryTypes.options);

    expect(queryResult).toStrictEqual(expectedOutput);
});

//tests r flag
test("-r flag", () => {
    const input = parseInput("query -dpt CIS -r");
    const queryTypes: Query = input.QueryTypes;
    //console.log(queryTypes.get('prerequisite'))
    const results = executeQuery(queryTypes, Object.values(courses)) as Course[];
    const expectedOutput = results.sort(compareCourseCode);
    const queryResult = getQueryResults(input, courses, input.QueryTypes.options);

    expect(queryResult).toStrictEqual(expectedOutput);
});
