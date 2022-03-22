import Course from "@dogs-barking/common/types/Course";

/**
 * Grabs a unique colour for a node based on the course code
 * @param  {Course} course
 * @param (String) courseType: determines the node color based on type of course (prereq, coreq, restriction)
 */
const getNodeColour = (course: Course, courseType: string) => {
    const { courseNumber } = course;
    let nodeColor = "";
    if (courseType !== "") {
        switch (courseType) {
            case "crq":
                nodeColor = "deepskyblue3";
                break;
            case "res":
                nodeColor = "firebrick3";
                break;
        }
    } else {
        if (courseNumber.toString().charAt(0) >= "8") {
            nodeColor = "aquamarine";
        } else if (courseNumber.toString().charAt(0) >= "7") {
            nodeColor = "brown1";
        } else if (courseNumber.toString().charAt(0) >= "6") {
            nodeColor = "cadetblue1";
        } else if (courseNumber.toString().charAt(0) >= "5") {
            nodeColor = "chocolate1";
        } else if (courseNumber.toString().charAt(0) >= "4") {
            nodeColor = "cornflowerblue";
        } else if (courseNumber.toString().charAt(0) >= "3") {
            nodeColor = "darkorchid1";
        } else if (courseNumber.toString().charAt(0) >= "2") {
            nodeColor = "gold1";
        } else if (courseNumber.toString().charAt(0) >= "1") {
            nodeColor = "gainsboro";
        } else {
            nodeColor = "deeppink1";
        }
    }
    return nodeColor;
};

export default getNodeColour;
