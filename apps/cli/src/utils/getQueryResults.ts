import gradCoursesOnly from "./gradCoursesOnly";
import undergradCoursesOnly from "./undergradCoursesOnly";
import executeQuery from "./executeQuery";
import compareCourseCode from "./compareCourseCode";
import compareCourseCodeDesc from "./compareCourseCodeDesc";
import compareWeight from "./compareWeight";
import { CourseIndex } from "@dogs-barking/common/types/Course";
import Input, { AuxOptions, Query } from "@dogs-barking/common/types/Input";
import { readdirSync, readFileSync } from "fs";

const courseArray = Object.values(JSON.parse(readFileSync("./packages/data/courses.json", "utf8")) as CourseIndex);

/**
 * @param  {Input} parsedInput
 * @param  {CourseIndex} testJSON
 * @param  {string[]} flags
 */
const getQueryResults = (
    parsedInput: Input,
    testJSON: CourseIndex,
    config: AuxOptions
) => {
    const queryTypes: Query = parsedInput.QueryTypes;
    let results = executeQuery(queryTypes, courseArray);

    // Filter by scope
    switch(config.Scope) {
        case "Grad":
            results = gradCoursesOnly(results);
            break;
        case "Undergrad":
            results = undergradCoursesOnly(results);
            break;
    }
    // Order by ascending/descending
    switch(config.SortDirection) {
        case "Descending":
            results.sort(compareCourseCodeDesc);
            break;
        case "Ascending":
            results.sort(compareCourseCode);
            break;
    }
    // Filter by sorting mode
    switch(config.SortMode) {
        case "Weight":
            results.sort(compareWeight);
            break;
    }
    return results;
};
export default getQueryResults;
