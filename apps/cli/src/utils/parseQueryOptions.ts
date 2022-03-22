import { SemestersOffered } from "types/Course";
import { AuxOptions, CourseScope, PrintMode, Query, SortDir, SortMode } from "types/Input";
import generateParamsArray from "../generateParamsArray";


/**
 * Parses query specific options from input
 */
const parseQueryOptions = (input:string):Query => {
    const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
    const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);
    const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");
    
    let degree = "";
    const major = "";
    let department = "";
    let coursecode = "";
    let weight = -1;
    let coursenum = -1;
    let level = -1;
    let prereq:string[] = [];
    const semester: SemestersOffered[] = [];
    let keywords:string[] = [];
    let path = false;
    let SortDir:SortDir = "Ascending";
    let scope:CourseScope = "All";
    let SortMode:SortMode = "Raw";
    let Print:PrintMode = "Regular";
    let school = "";
    const args = input.split(" ");
    //console.log(args);
    args.forEach((arg) => {
        const index: number = args.indexOf(arg) + 1;
        switch (arg){ // all modifer flags and native argument handlers
            case "-path":
                path = true;
                coursecode = args[index];
                return;
            case "-dpt":
                department = args[index];
                return;
            case "-title":
                keywords = generateParamsArray(args, "title", index);
                return;
            case "-prq":
                prereq = generateParamsArray(args, "prq", index);
                return;
            case "-level":
                level = args[index].match(/[1-9][0][0][0]/) ? Number(args[index]) : -1;
                return;
            case "-coursecode":
                coursecode = combinedCourseRegex.test(args[index]) ? args[index] : "";
                return;
            case "-coursenumber":
                coursenum = args[index].match(/[1-9][0-9]{3}/) ? Number(args[index]) : -1;
                return;
            case "-degree":
                degree = args[index];
                return;
            case "-desc":
                SortDir = "Descending";
                return;
            case "-school":
                school = args[index];
                return;
            default: // native parameter handling
                if (arg === "-makegraph"
                || arg === "-program" || arg === "-pdf") return; // ignore graph commands
                if (arg.includes("-")) {
                    if (arg.includes("u")) {
                        scope = "Undergrad";
                    } else if (arg.includes("g")) {
                        scope = "Grad";
                    }
                    if (arg.includes("w")) {
                        SortMode = "Weight";
                    }
                    if (arg.includes("d")) {
                        Print = "Detailed";
                    }
                }
                if (arg === "S" || arg === "W" || arg === "F") {
                    semester.includes(arg) ? null : semester.push(arg);
                } else if (Number(arg) >= 0.25 && Number(arg) <= 1) {
                    weight = Number(arg);
                }
        }
    });

    const aux:AuxOptions = {
        SortDirection: SortDir,
        SortMode: SortMode,
        Scope: scope,
        PrintMode: Print,
    };

    const queryObj: Query = {
        degree: degree,
        major: major,
        school: school,
        department: department,
        coursecode: coursecode,
        weight: weight,
        coursenum: coursenum,
        level: level,
        prerequisite: prereq,
        semester: semester,
        title: keywords,
        path: path,
        options: aux,
    };
    return queryObj;
};
export default parseQueryOptions;