import { Graph } from "graphviz";
import Course from "types/Course";
import getNodeColour from "../getNodeColour";
import { GraphOptions } from "types/Input";

/**
 * Javascript implementation of Java's hashCode() in java.lang.Object (djb2 algorithm)
 * Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 *
 * @param str
 * @returns A unique hash for the provided string
 */
const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        hash = (hash << 5) - hash + ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Adds a prerequisite node to the graph using different formatting to distinguish between different types of prerequisites
 * @param rootCourse Root course containing the prerequisites
 * @param graph Main graph containing the courses
 * @param prereqCode A string value of rootCourse's prerequisites
 * @param options An object with attributes of user inputted flags
 * @param type The type of node we are adding, 'crq' for corequisite, 'prq' for prereq, 'res' for restriction
 */
const addPrereqNode = (
    rootCourse: Course,
    graph: Graph,
    prereqCode: string,
    options: GraphOptions,
    type: string
) => {
    if (!graph || !prereqCode) {
        return;
    }
    prereqCode = prereqCode.replace("]", "");
    prereqCode = prereqCode.replace("[", "");
    prereqCode = prereqCode.replace(".", "");

    if (prereqCode.includes("/")) {
        if (options.school === "uofg") {
            const courseCodes = prereqCode.split("/");
            let labelText = "";
    
            const courseCode = rootCourse.departmentCode + "*" + rootCourse.courseNumber;
            const departmentCodeRegex = new RegExp(/[A-Z]{2,5}/);
            const courseCodeRegex = new RegExp(/[A-Z]{2,5}\*[0-9]{4}/g);
    
            // Generate label text formatted as a 'record' node in graphviz's dot engine
            courseCodes?.forEach((c) => {
                if (!options.includeExternalCourses && !c.match(courseCodeRegex)) {
                    c = "";
                }
    
                if (c !== "") {
                    labelText = labelText.concat(c, "|");
                }
                // Check for external courses if that includeExternalCourses is false
                if (!options.includeExternalCourses) {
                    const courses = c.match(courseCodeRegex);
                    courses?.forEach((course) => {
                        const departmentCode = course.match(departmentCodeRegex);
                        if (departmentCode && !rootCourse.departmentCode.includes(departmentCode[0])) {
                            labelText = labelText.replace("| " + course, "");
                            labelText = labelText.replace("and " + course + "|", "");
                        }
                    });
                }
            });
            if (!labelText.replace(/\s/g, "").length) return;
            labelText = labelText.substring(0, labelText.length - 1);
    
            // Generate a unique hash to use as the node's name
            const labelHash = hashCode(labelText).toString();
    
            // If hash doesn't already exist, add a new node to the graph with the prerequisites
            if (!graph.getNode(labelHash)) {
                const n = graph.addNode(labelHash, { color: getNodeColour(rootCourse, type) });
                let graphConfig = {};
                //console.log(labelText + "/" + labelHash);
    
                // Add nodes with dashed lines as borders for courses with "1 of" as prereqs
                if (prereqCode.includes("1 of")) {
                    labelText = labelText.replace("1 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "octagon") : null;
                } else if (prereqCode.includes("2 of")) {
                    labelText = labelText.replace("2 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "doubleoctagon") : null;
                } else if (prereqCode.includes("3 of")) {
                    labelText = labelText.replace("3 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "tripleoctagon") : null;
                } else {
                    //n.set("shape", "record");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "doubleoctagon") : null;
                }
                type === "res" ? n.set("shape", "pentagon") : null;
    
                switch (type) {
                    case "prq":
                        graphConfig = { minlen: "2" };
                        break;
                    case "res":
                        graphConfig = { minlen: "2", arrowhead: "box", color: "darkred" };
                        break;
                    case "crq":
                        graphConfig = {
                            minlen: "2",
                            dir: "both",
                            arrowhead: "empty",
                            arrowtail: "empty",
                            color: "deepskyblue",
                        };
                        break;
                    default:
                        graphConfig = { minlen: "2" };
                        break;
                }
    
                graph.addEdge(labelHash, courseCode, graphConfig);
                n.set("label", labelText);
            }
        } else if (options.school === "uoft") {
            const courseCodes = prereqCode.split("/");
            let labelText = "";
    
            const courseCode = rootCourse.departmentCode + rootCourse.courseNumber;
            const departmentCodeRegex = new RegExp(/[A-Z]{2,5}/);
            const courseCodeRegex2 = new RegExp(/[A-Z]{2,5}\*[0-9]{4}/g);
            const courseCodeRegex = new RegExp(/[A-Z]{3}[1-9]{3}/, "g");
            // Generate label text formatted as a 'record' node in graphviz's dot engine
            courseCodes?.forEach((c) => {
                if (!options.includeExternalCourses && !c.match(courseCodeRegex)) {
                    c = "";
                }
    
                if (c !== "") {
                    labelText = labelText.concat(c, "|");
                }
                // Check for external courses if that includeExternalCourses is false
                if (!options.includeExternalCourses) {
                    const courses = c.match(courseCodeRegex);
                    courses?.forEach((course) => {
                        const departmentCode = course.match(departmentCodeRegex);
                        if (departmentCode && !rootCourse.departmentCode.includes(departmentCode[0])) {
                            labelText = labelText.replace("| " + course, "");
                            labelText = labelText.replace("and " + course + "|", "");
                        }
                    });
                }
            });
            if (!labelText.replace(/\s/g, "").length) return;
            labelText = labelText.substring(0, labelText.length - 1);
    
            // Generate a unique hash to use as the node's name
            const labelHash = hashCode(labelText).toString();
    
            // If hash doesn't already exist, add a new node to the graph with the prerequisites
            if (!graph.getNode(labelHash)) {
                const n = graph.addNode(labelHash, { color: getNodeColour(rootCourse, type) });
                let graphConfig = {};
                //console.log(labelText + "/" + labelHash);
    
                // Add nodes with dashed lines as borders for courses with "1 of" as prereqs
                if (prereqCode.includes("1 of")) {
                    labelText = labelText.replace("1 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "octagon") : null;
                } else if (prereqCode.includes("2 of")) {
                    labelText = labelText.replace("2 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "doubleoctagon") : null;
                } else if (prereqCode.includes("3 of")) {
                    labelText = labelText.replace("3 of ", "");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "tripleoctagon") : null;
                } else {
                    //n.set("shape", "record");
                    type === "prq" ? n.set("shape", "record") : null;
                    type === "crq" ? n.set("shape", "doubleoctagon") : null;
                }
                type === "res" ? n.set("shape", "pentagon") : null;
    
                switch (type) {
                    case "prq":
                        graphConfig = { minlen: "2" };
                        break;
                    case "res":
                        graphConfig = { minlen: "2", arrowhead: "box", color: "darkred" };
                        break;
                    case "crq":
                        graphConfig = {
                            minlen: "2",
                            dir: "both",
                            arrowhead: "empty",
                            arrowtail: "empty",
                            color: "deepskyblue",
                        };
                        break;
                    default:
                        graphConfig = { minlen: "2" };
                        break;
                }
                graph.addEdge(labelHash, courseCode, graphConfig);
                n.set("label", labelText);
            }
        }
    }
};

export default addPrereqNode;
