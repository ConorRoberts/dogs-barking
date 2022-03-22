import { chromium, devices } from "playwright";
import ScraperOutput from "@dogs-barking/common/types/ScraperOutput";
import scrapeProgram from "./scrapeProgram";
import { ProgramIndex } from "@dogs-barking/common/types/Program";
import { CourseIndex } from "@dogs-barking/common/types/Course";
import scrapeCourses from "./scrapeCourses";

/**
 * 
 * @returns 
 */
const scrapeUoft = async (): Promise<ScraperOutput> => {
    const baseURL = "https://www.utoronto.ca";
    const startURL = "/academics/programs-directory/";
    //const outputPath = "./data/uot-majors.json";
    //const abbrevPath = "./data/uot-programAbbreviations.json";

    const startTime = new Date().getTime();

    let programs: ProgramIndex = {};
    let courses: CourseIndex = {};
    const programAbbreviations: [string, string][] = [];

    const MAX_PAGES: number = 17;
    let pagesVisited: number = 0;
    let nodeLinksVisited: number = 0;
    let pageAppendix: string = "";

    try {
        const browser = await chromium.launch();
        const context = await browser.newContext({
            ...devices["Desktop Chrome"],
        });

        do {
            const page = await context.newPage();
            console.log();
            console.log(("Scraping from: " + baseURL + startURL + pageAppendix).slice(0, 100));
            await page.goto(baseURL + startURL + pageAppendix);

            const degreeList = await page.$$(
                "#page > #main > #content > div.section > div.region > #block-system-main " +
                "> div.view > div.view-content > div.views-row"
            );

            for (const child of degreeList) {
                if (child === null) continue;

                try {
                    const degreeLink = await child.$("div.node > div.col-md-3 > a");
                    const degreeURL = await degreeLink?.getAttribute("href");
                    const degreeTitle = await degreeLink?.getAttribute("aria-label");
                    const degreeCampus = await degreeLink?.$("p.campus");
                    const degreeCampusTitle = await degreeCampus?.innerText();

                    if (degreeCampusTitle == "St. George") {
                        const programTitleLine = degreeTitle + " (" + degreeCampusTitle + ")";

                        const promptStr = "Scraping | " + programTitleLine + " @ " + degreeURL;
                        console.log(promptStr.length > 100 ? promptStr.slice(0, 100) + "..." : promptStr);

                        const progPage = await context.newPage();

                        if (degreeURL && progPage) {
                            await progPage.goto(degreeURL);
                            const programsTable = await progPage.$$("div.view-programs-view div.view-content > div");
                            programs = { ...programs, ...await scrapeProgram(programsTable) };

                            const coursesTable = await progPage.$$("div.view-courses-view div.view-content > div");
                            courses = { ...courses, ...await scrapeCourses(coursesTable) };

                            await progPage.close();
                        } else {
                            console.error("Couldn't access page for " + programTitleLine);
                        }

                        nodeLinksVisited++;
                    }
                } catch (programError) {
                    console.error(programError);
                }
            }

            await page.close();

            pagesVisited++;
            pageAppendix = "?page=" + pagesVisited;
        } while (pagesVisited < MAX_PAGES);

        await browser.close();
    } catch (scrapeError) {
        console.error(scrapeError);
    }

    const endTIme = new Date().getTime();
    const elapsedMinutes = Math.floor((endTIme - startTime) / 1000 / 60);
    const elapsedSeconds = Math.floor((endTIme - startTime) / 1000) % 60;

    console.log();
    console.log(`Scraping finished. Took ${elapsedMinutes}m${elapsedSeconds}s`);
    console.log("Pages Visited: " + pagesVisited);
    console.log("Programs Scraped: " + nodeLinksVisited);

    return { courses, programs, programAbbreviations };
};

export default scrapeUoft;