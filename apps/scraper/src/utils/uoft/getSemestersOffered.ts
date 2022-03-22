import { SemestersOffered } from "@dogs-barking/common/types/Course";

/**
 * Returns semesters offered for a UofT course code
 * @param text 
 * @returns 
 */
const getSemestersOffered = (text: string): SemestersOffered[] => {

    if (text === "F" || text === "1") {
        return ["F"];
    } else if (text === "S" || text === "2") {
        return ["W"];
    } else if (text === "Y") {
        return ["F", "W"];
    }

    return [];
};

export default getSemestersOffered;