import * as graphviz from "graphviz";
import { Options } from "graphviz";
import Course, { CourseIndex } from "types/Course";
import getNodeColour from "../getNodeColour";
import addPrereqNode from "../addPrereqNode";
import addLegend from "../addLegend";
import MakeGraphOptions from "types/MakeGraphOptions";
import addRegNode from "../addRegNode";
import { GraphOptions } from "types/Input";
import { readFileSync } from "fs";
const originalCourses = JSON.parse(readFileSync("./packages/data/courses.json", "utf8")) as CourseIndex;

const defaultOptions: MakeGraphOptions = {
    includeGraduateCourses: false,
    includeExternalCourses: false,
    saveAs: "graph.pdf",
    courseLimit: Infinity,
    hideCoreqs: false,
    showRestrictions: false,
};

/**
 * Creates a Graphviz representation of the relationship between course prerequisites.
 * @param courses An array of Course objects. This will typically be the result of a query.
 * @param options Options for how prerequisites are fetched and how the file is saved.
 * @return Returns a graphviz graph object -> to be printed either to terminal (printgraphtoterminal) or to a pdf (graphtopdf)
 */
const makeGraph = (courses: Course[], options: GraphOptions) => {
    const opts: GraphOptions = options;
    // Matches course codes of similar structure to AAA*0000
    //const courseCodeRegex = new RegExp(/[A-Z]{2,5}\*[0-9]{4}/g);

    let courseList: CourseIndex = {};

    // If this option is set, we'll need to grab other courses from the master data set
    if (opts?.includeExternalCourses) courseList = originalCourses;

    let courseListToGraph: Course[] = [...courses];

    if (!opts?.includeGraduateCourses)
        courseListToGraph = courseListToGraph.filter(({ courseNumber }) => courseNumber < 5000);

    const graph = graphviz.digraph("G");
    graph.setNodeAttribut("ranksep", 2);
    graph.setNodeAttribut("nodesep", 0.5);
    const courseGraph = graph.addCluster("cluster_courses");
    courseGraph.addNode("tailNode", { style: "invis" });

    // Iterate over every key/value pair of query result
    for (const course of courseListToGraph) {
        // Check if this course has a department code and a course number
        if (course?.courseNumber && course?.departmentCode) {
            // Get course code. This is just for convenience later.
            const { courseNumber, departmentCode } = course;
            const courseCode = departmentCode + "*" + courseNumber;
            // If we don't already have a node for this, make one
            if (!graph.get(courseCode)) {
                courseGraph.addNode(courseCode, {
                    style: "filled",
                    color: getNodeColour(course, ""),
                });
            }

            course?.prerequisites?.forEach((e) => {
                if (e.includes("/")) {
                    // This signifies that we have an "OR" clause
                    addPrereqNode(course, courseGraph, e, opts, "prq");
                } else {
                    // This signifies that the prerequisite is a singular course
                    const edgeAttributes : Options = {
                        minlen: "2",
                    };
                    addRegNode(courseCode, e, courseListToGraph, courseList, opts, courseGraph, edgeAttributes);
                }
            });

            if (!opts?.hideCoreqs) {
                for (const coreqCourse of course.corequisites) {
                    if (coreqCourse.includes("/")) {
                        // This signifies that we have an "OR" clause
                        addPrereqNode(course, courseGraph, coreqCourse, opts, "crq");
                    } else {
                        // This signifies that the co-rerequisite is a singular course
                        const edgeAttributes : Options = {
                            minlen: "2",
                            dir: "both",
                            arrowhead: "empty",
                            arrowtail: "empty",
                            color: "deepskyblue",
                        };
                        addRegNode(courseCode, coreqCourse, courseListToGraph, courseList, opts, courseGraph, edgeAttributes);
                    }
                }
            }

            if (opts?.showRestrictions) {
                course?.restrictions?.forEach((resCourse) => {
                    if (resCourse.includes("/")) {
                        // This signifies that we have an "OR" clause
                        addPrereqNode(course, courseGraph, resCourse, opts, "res");
                    } else {
                        const edgeAttributes : Options = {
                            minlen: "2",
                            arrowhead: "box",
                            color: "darkred",
                        };
                        addRegNode(courseCode, resCourse, courseListToGraph, courseList, opts, courseGraph, edgeAttributes);
                    }
                });
            }
        }
    }
    // Adds the legend to the graph
    addLegend(graph, courseListToGraph);
    // Connects legend subraph to the course subgraph via the invisible nodes 'headNode' and 'tailNode'
    graph.addEdge("headNode", "tailNode", { style: "invis" });
    return graph;
};

export default makeGraph;
