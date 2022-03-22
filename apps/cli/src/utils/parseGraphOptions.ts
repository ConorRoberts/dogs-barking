import { GraphOptions } from "types/Input";
import majorsFromArgs from "../majorsFromArgs";

/**
 * Takes in a string and parses the graph related options from it
 */
const parseGraphOptions = (input:string, school: string):GraphOptions => {
    // graph specific options
    // filename, courselimit, path, externals, grads, display (major, minor, AOE, options)
    let programGraph = false;
    let fileName = "graph.pdf";
    let limit = Infinity;
    let includeAllCourses = false;
    let gradCourses = false;
    let major = true;
    let minor = false;
    let area = false;
    let options = true;
    let mergePdf = false;
    let semester = "";
    let restrictions = false;
    let coreq = false;
    let majorProgram:string[] = [];
    let verbose = false;

    const args = input.split(" ");
    
    args.forEach((arg) => {
        const index = args.indexOf(arg);
        if (!arg.includes("-")) return;
        switch (arg){
            case "query" || "makegraph": // ignore initial command
                return;
            case "-pdf":
                fileName = args[index + 1];
                return;
            case "-ext":
                includeAllCourses = true;
                return;
            case "-limit":
                limit = Number(args[index + 1]);
                return;
            case "-program":
                majorProgram = majorsFromArgs(args, index + 1);
                programGraph = true;
                return;
            case "-major":
                major = true;
                return;
            case "-minor":
                major = false;
                area = false;
                minor = true;
                return;
            case "-AOE":
                major = false;
                minor = false;
                area = true;
                return;
            case "-AOC":
                major = false;
                minor = false;
                area = true;
                return;
            case "-options":
                options = false;
                return;
            case "-merge":
                mergePdf = true;
                return;
            case "-sem":
                semester = args[index + 1];
                return;
            default: // assume that the rest of the args are -rcgd
                // guard against query flags
                if (arg === "-prq"
                    || arg === "-dpt"
                    || arg === "-degree" || arg === "-school") return;
                if (arg.includes("r")) {
                    restrictions = true;
                }
                if (arg.includes("g")) {
                    gradCourses = true;
                }
                if (arg.includes("c")) {
                    coreq = true;
                }
                if (arg.includes("d")) {
                    verbose = true;
                }
                return;
        }
    });

    const graphConfig:GraphOptions = {
        graphType: programGraph ? "Program" : "Regular",
        graphMajor: majorProgram,
        terminal: verbose,
        includeExternalCourses: includeAllCourses,
        includeGraduateCourses: gradCourses,
        saveAs: fileName,
        courseLimit: limit,
        hideCoreqs: coreq,
        showRestrictions: restrictions,
        displayMajor: major,
        displayMinor: minor,
        displayArea: area,
        displayOptions: options,
        mergePdf: mergePdf,
        semester: semester,
        school: school,
    };
    
    return graphConfig;
};

export default parseGraphOptions;