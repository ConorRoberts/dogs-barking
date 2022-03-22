//import { CourseIndex } from "types/Course";
import ScraperOutput from "@dogs-barking/common/types/ScraperOutput";
import scrapeUofgCourses from "./courses";
import scrapeUofgPrograms from "./programs";

/**
 * 
 */
const scrapeUofg = async (): Promise<ScraperOutput> => {
    const courses = await scrapeUofgCourses();
    const { programs, programAbbreviations } = await scrapeUofgPrograms();

    return { programs, programAbbreviations, courses };
};

export default scrapeUofg;