import { SemestersOffered } from "types/Course";

/**
 * Returns semesters offered for a UW course code
 * @param text 
 * @returns 
 */
const getSemestersOffered = (text: string): SemestersOffered[] => {

    if (text === "F") {
        return ["F"];
    } else if (text === "W") {
        return ["W"];
    } else if (text === "S") {
        return ["S"];
    }

    return [];
};

export default getSemestersOffered;