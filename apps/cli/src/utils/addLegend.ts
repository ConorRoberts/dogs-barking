import { Graph } from "graphviz";
import Course from "types/Course";
import getNodeColour from "../getNodeColour";

export interface CourseNumber {
    [courseNumber: number]: Course;
}

/**
 * Adds a legend onto the graph structure based on the courses provided
 * @param {Graph} graph Main graph containing the courses
 * @param {Course[]} courses A list of Course objects
 */
const addLegend = (graph: Graph, courses: Course[]) => {
    if (!graph) {
        return;
    }

    const legendCluster = graph.addCluster("cluster_legend");
    legendCluster.set("fontsize", 15);
    legendCluster.set("label", "Legend");
    legendCluster.set("ranksep", "0");

    const recordCluster = legendCluster.addCluster("recordCluster");
    recordCluster.set("rank", "same");
    recordCluster.addNode("headNode", {
        shape: "plaintext",
        label: "x or y / 1 of x, y, z",
    });
    recordCluster.addNode("record", { shape: "record", label: "x|y|z" });
    //recordCluster.addEdge("record", "recordDesc");

    const coreqCluster = legendCluster.addCluster("coreqCluster");
    coreqCluster.set("rank", "same");
    coreqCluster.addNode("coreqDesc", {
        shape: "plaintext",
        label: "x & y are corequisites",
    });
    coreqCluster.addNode("coreq1", {
        shape: "plaintext",
        label: "x",
    });
    coreqCluster.addNode("coreq2", {
        shape: "plaintext",
        label: "y",
    });
    coreqCluster.addEdge("coreq1", "coreq2", {
        minlen: "2",
        dir: "both",
        arrowhead: "empty",
        arrowtail: "empty",
        color: "deepskyblue",
    });
    coreqCluster.addEdge("coreq2", "coreqDesc", {
        style: "invis",
    });

    const resCluster = legendCluster.addCluster("resCluster");
    resCluster.set("rank", "same");
    resCluster.addNode("resDesc", {
        shape: "plaintext",
        label: "y is a restriction of x",
    });
    resCluster.addNode("restrict1", {
        shape: "plaintext",
        label: "x",
    });
    resCluster.addNode("restrict2", {
        shape: "plaintext",
        label: "y",
    });
    resCluster.addEdge("restrict1", "restrict2", { minlen: "2", arrowhead: "box", color: "darkred" });
    resCluster.addEdge("restrict2", "resDesc", {
        style: "invis",
    });

    const course: Course = {} as Course;

    // Create legend dynamically (only add to legend if present in course)
    const exists: number[] = [];
    const courseToLegend = new Map();

    // Setup map for course code to graph legend names
    courseToLegend.set(1000, ["firstLvlCluster", "firstLvlDesc", "firstLvlNode"]);
    courseToLegend.set(2000, ["secondLvlCluster", "secondLvlDesc", "secondLvlNode"]);
    courseToLegend.set(3000, ["thirdLvlCluster", "thirdLvlDesc", "thirdLvlNode"]);
    courseToLegend.set(4000, ["fourthLvlCluster", "fourthLvlDesc", "fourthLvlNode"]);
    courseToLegend.set(5000, ["fifthLvlCluster", "fifthLvlDesc", "fifthLvlNode"]);
    courseToLegend.set(6000, ["sixLvlCluster", "sixLvlDesc", "sixLvlNode"]);
    courseToLegend.set(7000, ["sevenLvlCluster", "sevenLvlDesc", "sevenLvlNode"]);
    courseToLegend.set(8000, ["eightLvlCluster", "eightLvlDesc", "eightLvlNode"]);

    // Only need unique levels in order
    courses.forEach((course) => {
        if(!course) return;
        const element = Number(String(course.courseNumber).charAt(0) + "000");
        if (exists.indexOf(element) === -1) exists.push(element);
    });

    // Create only the clusters required
    for (let i = 0; i < exists.length; i++) {
        course.courseNumber = exists[i];
        const courseToLegendArr = courseToLegend.get(exists[i]);
        const newCluster = legendCluster.addCluster(courseToLegendArr[0]);
        newCluster.set("rank", "same");
        newCluster.addNode(courseToLegendArr[1], {
            shape: "plaintext",
            label: exists[i] + " Level Course",
        });
        newCluster.addNode(courseToLegendArr[2], {
            style: "filled",
            label: "courseCode",
            color: getNodeColour(course, ""),
        });
        //TODO: add arrows
    }

    // Connect all clusters to get them in order properly
    for (let i = 0; i < exists.length; i++) {
        const courseToLegendArr = courseToLegend.get(exists[i]);
        if (i === 0) {
            legendCluster.addEdge("headNode", "coreq1", {
                style: "invis",
                lhead: "recordCluster",
                ltail: "coreqCluster",
            });
            legendCluster.addEdge("coreq1", "restrict1", {
                style: "invis",
                lhead: "coreqCluster",
                ltail: "resCluster",
            });
            legendCluster.addEdge("coreqDesc", "resDesc", {
                style: "invis",
                lhead: "coreqCluster",
                ltail: "resCluster",
            });
            legendCluster.addEdge("restrict1", courseToLegendArr[1], {
                style: "invis",
                lhead: "resCluster",
                ltail: courseToLegendArr[0],
            });
            legendCluster.addEdge("resDesc", courseToLegendArr[2], {
                style: "invis",
                lhead: "resCluster",
                ltail: courseToLegendArr[0],
            });
        } else {
            const courseToLegendPrevArr = courseToLegend.get(exists[i - 1]);
            legendCluster.addEdge(courseToLegendPrevArr[1], courseToLegendArr[1], {
                style: "invis",
                lhead: courseToLegendPrevArr[0],
                ltail: courseToLegendArr[0],
            });
            legendCluster.addEdge(courseToLegendPrevArr[2], courseToLegendArr[2], {
                style: "invis",
                lhead: courseToLegendPrevArr[0],
                ltail: courseToLegendArr[0],
            });
        }
    }
};

export default addLegend;
