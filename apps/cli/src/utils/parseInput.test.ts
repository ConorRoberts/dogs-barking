import Input, { AuxOptions, GraphOptions, Query } from "types/Input";
import parseInput from ".";

const graphObj: GraphOptions = {
    graphType: "Regular",
    includeExternalCourses: false,
    includeGraduateCourses: false,
    saveAs: "graph.pdf",
    courseLimit: Infinity,
    hideCoreqs: false,
    showRestrictions: false,
    displayArea: false,
    displayMajor: true,
    displayMinor: false,
    displayOptions: true,
    graphMajor: [""],
    terminal: false,
    mergePdf: false,
};

const defaultAuxOpts: AuxOptions = {
    SortDirection: "Ascending",
    SortMode: "Raw",
    Scope: "All",
    PrintMode: "Regular",
};

/** Query System Testing */
test("-h flag", () => {
    const testString = "query -h";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: true,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("-dpt flag", () => {
    const testString = "query -dpt CIS";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "CIS",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("-prq [coursecode]", () => {
    const testString = "query -prq CIS*1300";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: ["CIS*1300"],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("-prq [credits][coursecode]", () => {
    const testString = "query -prq 15.00 credits CIS*1300";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: ["15.00 credits", "CIS*1300"],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("combined -dpt and -prq", () => {
    const testString = "query -prq 15.00 credits CIS*1300 -dpt CIS";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "CIS",
        level: -1,
        prerequisite: ["15.00 credits", "CIS*1300"],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("combined -dpt and -prq 2", () => {
    const testString = "query -prq CIS*1300 -dpt CIS";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "CIS",
        level: -1,
        prerequisite: ["CIS*1300"],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("native parameters (semester)", () => {
    const testString = "query S F W";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: ["S", "F", "W"],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("native parameters (credit)", () => {
    const testString = "query 0.75";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: 0.75,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("native parameters, (credit and semester)", () => {
    const testString = "query F W 0.75";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: 0.75,
        semester: ["F", "W"],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graphObj,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("query -degree B.A.", () => {
    const testString = "query -degree B.A.";
    const queries: Query = {
        degree: "B.A.",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("-school flag", () => {
    const testString = "query -school UofG";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "UofG",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("-school flag 2", () => {
    const testString = "query -school UofT";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "UofT",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "query",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

/** Graph System Testing */
test("makegraph options, -pdf", () => {
    const testString = "makegraph -pdf test.pdf";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "test.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -ext", () => {
    const testString = "makegraph -ext";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: true,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -limit", () => {
    const testString = "makegraph -limit 10";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: 10,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -path", () => {
    const testString = "makegraph -path CIS*3110";
    const queries: Query = {
        degree: "",
        coursecode: "CIS*3110",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: true,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 4 letter", () => {
    const testString = "makegraph -program PSYC";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["PSYC"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 3 letter", () => {
    const testString = "makegraph -program ANT";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["ANT"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 2 letter", () => {
    const testString = "makegraph -program CS";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CS"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 2 letter coop", () => {
    const testString = "makegraph -program CS:C";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CS:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 4 letter coop", () => {
    const testString = "makegraph -program CENG:C";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CENG:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program 3 letter coop", () => {
    const testString = "makegraph -program ANT:C";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["ANT:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program hide major", () => {
    const testString = "makegraph -program CENG:C -major";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CENG:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program show minor", () => {
    const testString = "makegraph -program CENG:C -minor";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CENG:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: false,
        displayMinor: true,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program show Area 1 (AOE)", () => {
    const testString = "makegraph -program CENG:C -AOE";

    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CENG:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: true,
        displayMajor: false,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test("makegraph options, -program show Area 2 (AOC)", () => {
    const testString = "makegraph -program CENG:C -AOC";
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: defaultAuxOpts,
    };
    const graph: GraphOptions = {
        graphType: "Program",
        graphMajor: ["CENG:C"],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: true,
        displayMajor: false,
        displayMinor: false,
        displayOptions: true,
        terminal: false,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});

test ("makegraph options, output to terminal", () => {
    const testString = "makegraph -d";
    const AuxOptions:AuxOptions = {
        SortDirection: "Ascending",
        SortMode: "Raw",
        Scope: "All",
        PrintMode: "Detailed",
    };
    const queries: Query = {
        degree: "",
        coursecode: "",
        major: "",
        school: "",
        coursenum: -1,
        department: "",
        level: -1,
        prerequisite: [],
        weight: -1,
        semester: [],
        title: [],
        path: false,
        options: AuxOptions,
    };
    const graph: GraphOptions = {
        graphType: "Regular",
        graphMajor: [""],
        includeExternalCourses: false,
        includeGraduateCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayArea: false,
        displayMajor: true,
        displayMinor: false,
        displayOptions: true,
        terminal: true,
        mergePdf: false,
    };
    const expected: Input = {
        Command: "makegraph",
        QueryTypes: queries,
        Graph: graph,
        help: false,
    };
    expect(parseInput(testString)).toEqual(expected);
});
