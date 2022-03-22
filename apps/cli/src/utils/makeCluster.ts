import Course, { CourseIndex } from "types/Course";
import { GraphOptions } from "types/Input";
import { Graph } from "graphviz";
import getNodeColour from "../getNodeColour";
import addPrereqNode from "../addPrereqNode";
import addRegNode from "../addRegNode";
import { readFileSync } from "fs";

const originalCourses = JSON.parse(readFileSync("./packages/data/courses.json", "utf8")) as CourseIndex;

/**
 * Takes in a set of courses, returns a graphviz cluster, done in place
 * @param graph (Graph) -> The graph we are adding the cluster to
 * @param cluster (Cluster) -> The cluster we are populating with data
 * @param courses (Course[]) -> The list of all course offerings we are adding to the cluster
 * @param options (Graphoptions) -> The graph config
 * @returns a graphviz cluster, containing all prereq, coreq, restriction nodes setup
 */
const makeCluster = (graph: Graph, cluster: Graph, courses: Course[], options: GraphOptions) => {
    const courseCodeRegex = new RegExp(/[A-Z]{2,5}\*[0-9]{4}/g);
    const uoftRegex = new RegExp(/[A-Z]{3}[1-9]{3}[A-Z][1-9]/, "g");
    let courseList: CourseIndex = {};
    // If this option is set, we'll need to grab other courses from the master data set
    if (options?.includeExternalCourses) courseList = originalCourses;

    let courseListToGraph: Course[] = [...courses];

    /*TODO: Re implement grad course filter
    if (!options?.includeGraduateCourses)
        courseListToGraph = courseListToGraph.filter(({ courseNumber }) => courseNumber <= 5000);
    */
    // Run through every key/value pair of the supplied courses
    for (const course of courseListToGraph) {
        // data validation
        if (course?.courseNumber && course?.departmentCode) {
            const { courseNumber, departmentCode } = course;
            let courseCode = departmentCode + "*" + courseNumber;
            options.school === "uofg"
                ? (courseCode = departmentCode + "*" + courseNumber)
                : (courseCode = departmentCode + courseNumber);
            if (!graph.get(courseCode)) {
                cluster.addNode(courseCode, {
                    style: "filled",
                    color: getNodeColour(course, ""),
                });
            }
            course?.prerequisites?.forEach((e) => {
                if (e.includes("/")) {
                    // This signifies that we have an "OR" clause
                    addPrereqNode(course, cluster, e, options, "prq");
                } else {
                    // This signifies that the prerequisite is a singular course
                    const edgeAttributes = {
                        minlen: "2",
                    };
                    addRegNode(courseCode, e, courseListToGraph, courseList, options, cluster, edgeAttributes);
                }
            });
            if (!options?.hideCoreqs) {
                for (const coreqCourse of course.corequisites) {
                    if (coreqCourse.includes("/")) {
                        // This signifies that we have an "OR" clause
                        addPrereqNode(course, cluster, coreqCourse, options, "crq");
                    } else {
                        // This signifies that the co-rerequisite is a singular course
                        const edgeAttributes = {
                            minlen: "2",
                            dir: "both",
                            arrowhead: "empty",
                            arrowtail: "empty",
                            color: "deepskyblue",
                        };
                        addRegNode(
                            courseCode,
                            coreqCourse,
                            courseListToGraph,
                            courseList,
                            options,
                            cluster,
                            edgeAttributes
                        );
                    }
                }
            }
            if (options?.showRestrictions) {
                course?.restrictions?.forEach((resCourse) => {
                    if (resCourse.includes("/")) {
                        // This signifies that we have an "OR" clause
                        addPrereqNode(course, cluster, resCourse, options, "res");
                    } else {
                        // This signifies that prerequisite is a single course
                        const edgeAttributes = {
                            minlen: "2",
                            arrowhead: "box",
                            color: "darkred",
                        };
                        addRegNode(
                            courseCode,
                            resCourse,
                            courseListToGraph,
                            courseList,
                            options,
                            cluster,
                            edgeAttributes
                        );
                    }
                });
            }
        }
    }
    return courseListToGraph;
};

export default makeCluster;
