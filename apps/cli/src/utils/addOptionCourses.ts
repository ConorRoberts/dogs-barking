import { Graph } from "graphviz";
import { CourseIndex } from "types/Course";
import Option from "types/Option";
import getNodeColour from "../getNodeColour";

const addOptionCourses = (option: Option, optionGraph : Graph, courses : CourseIndex, index:number) => {
    if (option.courses.length > 5) {
        let j = 0;
        optionGraph.addNode("extraCoursesNode" + index, {
            label : "and " + (option.courses.length - 5) + " more...",
            color : getNodeColour(courses[option.courses[0]], ""),
            style : "filled",
        })
        for (const course of option.courses) {
            optionGraph.addNode(course, {
                color: getNodeColour(courses[course], ""),
                style : "filled",
            });
            j++;
            if (j == 5) {
                break;
            }
        }
        if (option.text) {
            optionGraph.set("label", option.text);
        }
    } else {
        for (const course of option.courses) {
            optionGraph.addNode(course, {
                color: getNodeColour(courses[course], ""),
                style : "filled",
            });
        }
        if (option.text) {
            optionGraph.set("label", option.text);
        }
    }
}

export default addOptionCourses;