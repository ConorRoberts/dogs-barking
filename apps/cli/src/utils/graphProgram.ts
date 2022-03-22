import Course, { CourseIndex } from "types/Course";
import { GraphOptions } from "types/Input";
import Program from "types/Program";
import Section from "types/Section";
import * as graphviz from "graphviz";
import addLegend from "../addLegend";
import addOptionCourses from "../addOptionCourses";
import makeCluster from "../makeCluster";
import getNodeColour from "../getNodeColour";
import generateMajorCourses from "../generateMajorCourses";
import generateMinorCourses from "../generateMinorCourses";
import generateOptionsCourses from "../generateOptionsCourses";
import generateAreaCourses from "../generateAreaCourses";

/**
 * Wrapper function that creates a graph from the program object
 * @param program {Program} -> The degree program we are building the graph of
 * @param options {GraphOptions} -> a set of graph options
 * @param major (String) -> The string representation of the degree program
 * @returns a graphviz graph representation of the program object
 */
const graphProgram = (program: Program, options: GraphOptions, major: string, courses: CourseIndex) => {
    const graph = graphviz.digraph("G");
    graph.set("concentrate", "true");
    graph.setNodeAttribut("ranksep", 2);
    graph.setNodeAttribut("nodesep", 0.5);

    let courseListToGraph: Course[] = [];
    // Initialize Clusters
    const majorGraph = graph.addCluster("cluster_Major");
    majorGraph.set("label", "Major Courses");
    majorGraph.addNode("tailMajorNode", { style: "invis" });

    const minorGraph = graph.addCluster("cluster_Minor");
    minorGraph.set("label", "Minor Courses");
    minorGraph.addNode("tailMinorNode", { style: "invis" });

    const areaGraph = graph.addCluster("cluster_AOC");
    areaGraph.set("label", "Area of Emphasis");
    areaGraph.addNode("tailAreaNode", { style: "invis" });

    //setting graph attributes
    graph.set("labelloc", "tc");
    graph.set("label", "Major - " + major);
    graph.set("fontsize", 30);

    majorGraph.set("fontsize", 15);
    minorGraph.set("fontsize", 15);
    areaGraph.set("fontsize", 15);

    if (program.major) {
        // Generate courses in program's major, makes the cluster, and adds major courses to courseListToGraph
        const progMajor = program.major;
        const majorOptions = progMajor?.options;
        const majorCourses = options.semester.length 
            ? generateMajorCourses(progMajor as Section, courses, options.school, "Semester " + options.semester).filter((course) => course !== undefined)
            : generateMajorCourses(progMajor as Section, courses, options.school).filter((course) => course !== undefined);
        // Adds courses from major courses (include prereqs as well if -major flag included, if not only add nodes)
        if (options.displayMajor) {
            makeCluster(graph, majorGraph, majorCourses, options);
        } else {
            for (const course of majorCourses) {
                const { courseNumber, departmentCode } = course;
                let courseCode = departmentCode + "*" + courseNumber;
                options.school === "uofg" ? courseCode = departmentCode + "*" + courseNumber : courseCode = departmentCode + courseNumber;
                majorGraph.addNode(courseCode + "_major", {
                    style: "filled",
                    color: getNodeColour(course, ""),
                    label: courseCode,
                });
            }
        }

        courseListToGraph = courseListToGraph.concat(majorCourses);

        // Adds a cluster for each option in a program's major
        if (majorOptions && options.displayOptions) {
            let i = 1;
            for (const option of majorOptions) {
                const clusterName = "cluster_majorOption" + i;
                const optionGraph = majorGraph.addCluster(clusterName);
                if (option.text) {
                    optionGraph.addNode(option.text, { shape: "plaintext" });
                    optionGraph.set("label", "");
                }
                i++;
            }
        }
    }
    if (program.minor) {
        const progMinor = program.minor;
        const minorOptions = progMinor?.options;

        //Create a subgraph of the minor object
        const minorCourses = options.semester.length 
            ? generateMinorCourses(progMinor as Section, courses, "Semester " + options.semester).filter((course) => course !== undefined)
            : generateMinorCourses(progMinor as Section, courses).filter((course) => course !== undefined);

        // Adds courses from minor courses (include prereqs as well if -minor flag included, if not only add nodes)
        if (options.displayMinor) {
            makeCluster(graph, minorGraph, minorCourses, options);
        } else {
            for (const course of minorCourses) {
                if (!course) continue;
                const { courseNumber, departmentCode } = course;
                let courseCode = departmentCode + "*" + courseNumber;
                options.school === "uofg" ? courseCode = departmentCode + "*" + courseNumber : courseCode = departmentCode + courseNumber;
                minorGraph.addNode(courseCode + "_minor", {
                    style: "filled",
                    color: getNodeColour(course, ""),
                    label: courseCode,
                });
            }
        }

        courseListToGraph = courseListToGraph.concat(minorCourses);

        // Adds a cluster for each option in a program's minor
        if (minorOptions && options.displayOptions) {
            let i = 1;
            for (const option of minorOptions) {
                const clusterName = "cluster_minorOption" + i;
                const optionGraph = minorGraph.addCluster(clusterName);
                if (option.text) {
                    optionGraph.addNode(option.text, { shape: "plaintext" });
                    optionGraph.set("label", "");
                }
                i++;
            }
        }
    }

    if (program.area) {
        // take the object and convert it into its elements, area and options
        const progArea = program.area;
        const areaOptions = progArea?.options;
        const areaCourses = options.semester.length 
            ? generateAreaCourses(progArea as Section, courses, "Semester " + options.semester).filter((course) => course !== undefined)
            : generateAreaCourses(progArea as Section, courses).filter((course) => course !== undefined);

        // Adds courses from major courses (include prereqs as well if -major flag included, if not only add nodes)
        if (options.displayArea) {
            makeCluster(graph, areaGraph, areaCourses, options);
        } else {
            for (const course of areaCourses) {
                const { courseNumber, departmentCode } = course;
                let courseCode = departmentCode + "*" + courseNumber;
                options.school === "uofg" ? courseCode = departmentCode + "*" + courseNumber : courseCode = departmentCode + courseNumber;
                areaGraph.addNode(courseCode + "_", {
                    style: "filled",
                    color: getNodeColour(course, ""),
                    label: courseCode,
                });
            }
        }

        courseListToGraph = courseListToGraph.concat(areaCourses);

        // Adds a cluster for each option in a program's area
        if (areaOptions && options.displayOptions) {
            let iter = 1;
            for (const opt of areaOptions) {
                if (!opt) break;
                const optArr = generateOptionsCourses(opt, courses);
                if (optArr.length <= 0) break;
                const optionCluster = areaGraph.addCluster("cluster_option" + iter);
                if (opt.text) {
                    optionCluster.addNode(opt.text, { shape: "plaintext" });
                    optionCluster.set("label", "");
                }
                iter++;
            }
        }
    }

    // Link graphs in proper order
    graph.addEdge("headNode", "tailMajorNode", { style: "invis" });
    graph.addEdge("tailMajorNode", "tailMinorNode", { style: "invis" });
    graph.addEdge("tailMinorNode", "tailAreaNode", { style: "invis" });

    addLegend(graph, courseListToGraph);
    // Connects legend subraph to the course subgraph via the invisible nodes 'headNode' and 'tailNode'
    if (graph.getCluster("cluster_Major")) {
        graph.addEdge("headNode", "tailMajorNode", { style: "invis" });
    } else if (graph.getNode("cluster_Minor")) {
        graph.addEdge("headNode", "tailMinorNode", { style: "invis" });
    } else if (graph.getNode("cluster_Area")) {
        graph.addEdge("headNode", "tailAreaNode", { style: "invis" });
    }
    //console.log(graph.to_dot());
    return graph;
};

export default graphProgram;
