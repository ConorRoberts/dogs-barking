import { SemestersOffered } from "@dogs-barking/common/types/Course";

/**
 * This function takes the string format of course.offering (Fall only) and converts it to a single letter, SFW Accordingly
 *
 * @returns {SemestersOffered} List containing the semesters offered in letter format
 */
const generateSemesters = (offering: string): SemestersOffered[] => {
    const courseOffering: SemestersOffered[] = [];

    if (!(typeof offering === "undefined") && !(offering === null)) {
        if (offering.includes("Fall")) {
            courseOffering.push("F");
        }
        if (offering.includes("Winter")) {
            courseOffering.push("W");
        }
        if (offering.includes("Summer")) {
            courseOffering.push("S");
        }
    }

    return courseOffering;
};

export default generateSemesters;
