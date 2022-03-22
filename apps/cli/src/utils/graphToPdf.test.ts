import makeGraph from "../makeGraph";
import { Graph } from "graphviz";
import graphToPdf from ".";
import { GraphOptions } from "types/Input";
import courses from "data/courses";

test("passing case", () => {
    const testGraph: Graph = makeGraph(
        Object.values(courses)
            .filter((e) => e.departmentCode === "CIS")
            .map((course) => ({ ...course, restrictions: [] }))
    );
    const defaultOptions: GraphOptions = {
        graphType: "Regular",
        includeGraduateCourses: false,
        includeExternalCourses: false,
        saveAs: "graph.pdf",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayMajor: true,
        displayMinor: false,
        displayArea: false,
        displayOptions: true,
        terminal: false,
        graphMajor: "",
    };
    const result = graphToPdf(testGraph, defaultOptions);

    expect(result).toEqual(1);
});

test("failing case due to filename", () => {
    const testGraph: Graph = makeGraph(
        Object.values(courses)
            .filter((e) => e.departmentCode === "CIS")
            .map((course) => ({ ...course, restrictions: [] }))
    );
    const defaultOptions: GraphOptions = {
        graphType: "Regular",
        includeGraduateCourses: false,
        includeExternalCourses: false,
        saveAs: "graph",
        courseLimit: Infinity,
        hideCoreqs: false,
        showRestrictions: false,
        displayMajor: true,
        displayMinor: false,
        displayArea: false,
        displayOptions: true,
        terminal: false,
        graphMajor: "",
    };
    const result = graphToPdf(testGraph, defaultOptions);

    expect(result).toEqual(0);
});
