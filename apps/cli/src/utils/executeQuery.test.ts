import executeQuery from ".";
//import { Query } from "types/Input";
import parseInput from "cli-utils/parseInput";
import coursesByDepartmentCode from "query-utils/coursesByDepartmentCode";
import coursesByCourseNumber from "query-utils/coursesByCourseNumber";
import coursesByCredits from "query-utils/coursesByCredits";
import courses from "data/courses";

test("Testing Department", () => {
    const input = parseInput("query -dpt CIS");
    expect(executeQuery(input.QueryTypes, Object.values(courses))).toEqual(
        coursesByDepartmentCode(Object.values(courses), "CIS")
    );
});

test("Testing courseNumber", () => {
    const input = parseInput("query -coursenumber 1000");
    expect(executeQuery(input.QueryTypes, Object.values(courses))).toEqual(
        coursesByCourseNumber(Object.values(courses), 1000)
    );
});

test("Testing weight in CIS department", () => {
    const input = parseInput("query -w 0.5 -dpt CIS");
    expect(executeQuery(input.QueryTypes, Object.values(courses))).toEqual(
        coursesByCredits(coursesByDepartmentCode(Object.values(courses), "CIS"), 0.5)
    );
});
