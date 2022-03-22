import { YearsOffered } from "@dogs-barking/common/types/Course";
/**
 * @param  {string} text?
 * @returns YearsOffered
 */
const getYearsOffered = (text?: string): YearsOffered => {
    if (text) {
        if (text.toLowerCase().includes("even")) return "even";
        else if (text.toLowerCase().includes("odd")) return "odd";
    }

    return "all";
};

export default getYearsOffered;
