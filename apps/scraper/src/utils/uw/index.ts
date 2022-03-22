import { CourseIndex } from "types/Course";
import ScraperOutput from "types/ScraperOutput";
//import scrapeUWCourses from "./courses";
import scrapeUWPrograms from "./programs";

/**
 * 
 */
const scrapeUW = async (): Promise<ScraperOutput> => {
    //const courses = await scrapeUWCourses();
    const courses: CourseIndex = {};
    const { programs, programAbbreviations } = await scrapeUWPrograms();

    return { programs, programAbbreviations, courses };
};

export default scrapeUW;