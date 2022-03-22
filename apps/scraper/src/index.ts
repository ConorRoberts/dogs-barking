import fs from "fs";
import scrapeUofg from "utils/uofg";
import scrapeUoft from "utils/uoft";
import "tsconfig-paths/register";
// import scrapeUW from "scraper-utils/schools/scrapeUW";

(async () => {
    // const UW = await scrapeUW();
    const uofg = await scrapeUofg();
    const uoft = await scrapeUoft();

    const courses = {
        // ...UW.courses,
        ...uofg.courses,
        ...uoft.courses,
    };
    const programs = {
        // ...UW.programs,
        ...uofg.programs,
        ...uoft.programs,
    };

    const programAbbreviations = {
        // ...UW.programAbbreviations,
        ...uofg.programAbbreviations,
        ...uoft.programAbbreviations,
    };

    // Check if ./data exists and make if not
    if (!fs.existsSync("./data")) fs.mkdirSync("./data");

    // Write courses to ./data/courses.json
    fs.writeFileSync("./data/courses.json", JSON.stringify(courses, null, "\t"));

    // Write programs to ./data/programs.json
    fs.writeFileSync("./data/programs.json", JSON.stringify(programs, null, "\t"));

    // Write program abbreviations to ./data/programAbbreviations.json
    fs.writeFileSync("./data/programAbbreviations.json", JSON.stringify(programAbbreviations, null, "\t"));
})();
