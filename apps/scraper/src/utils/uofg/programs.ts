import { chromium, devices } from "playwright";
import scrapeProgram from "./scrapeProgram";
import { ProgramIndex } from "@dogs-barking/common/types/Program";

const baseUrl = "https://calendar.uoguelph.ca";
const startUrl = "/undergraduate-calendar/degree-programs/";

/**
 *
 */
const scrapeUofgPrograms = async (): Promise<{ programs: ProgramIndex; programAbbreviations: [string, string][] }> => {
    const programAbbreviations: [string, string][] = [];

    const startTime = new Date().getTime();
    const programs: ProgramIndex = {};

    try {
        const browser = await chromium.launch();

        const context = await browser.newContext({
            ...devices["Desktop Chrome"],
        });

        const page = await context.newPage();

        console.log("Scraping from: " + baseUrl + startUrl);
        await page.goto(baseUrl + startUrl);

        // Get list of items within each alphabetical category
        const degreeList = await page.$$("div.page_content div.sitemap > ul > li a");

        for (const degree of degreeList) {
            if (degree === null) continue;
            const linkHref = await degree.getAttribute("href");

            const degreeCodeText = await degree.innerText();
            let degreeCode = degreeCodeText
                .match(/\[.+\]/g)
                ?.at(0)
                ?.slice(1, -1);

            if (!degreeCode)
                degreeCode = degreeCodeText
                    .match(/\(.+\)/g)
                    ?.at(0)
                    ?.slice(1, -1);

            if (!degreeCode) degreeCode = "None";

            const degreePage = await context.newPage();
            await degreePage.goto(baseUrl + linkHref + "#programstext");

            // Does this page contain a requirements button?
            const requirementsButton = await degreePage.$("#requirementstexttab > a,#scheduleofstudiestexttab > a");
            if (requirementsButton) {
                await requirementsButton.click();
                const pageTitle = await degreePage.$("#contentarea h1");
                
                if (!pageTitle) continue;
                try {
                    const programTitle = (await pageTitle.innerText()).replace(/ *\([^)]*\) */g, "");
                    const programCode = ((await pageTitle.innerText()).match(/\(.+\)/g) ?? [])[0]?.slice(1, -1);
                    programs[programCode] = await scrapeProgram(degreePage, degreeCode, programTitle);
                } catch (error) {
                    console.error(error);
                }
                continue;
            }

            // Get list of courses within department
            const programList = await degreePage.$$("div.sitemap > ul > li a");

            for (const program of programList) {
                if (program === null) continue;
                try {
                    const programUrl = await program.getAttribute("href");
                    let progName = await program.innerText();
                    const programCode = ((await program.innerText()).match(/\(.+\)/g) ?? [])[0].slice(1, -1);
                    console.log("Scraping for " + programCode);

                    if (progName.includes(" (")) {
                        const splitProgName: string[] = progName.split(" (");
                        const progTitle = splitProgName[0];
                        programAbbreviations.push([progTitle, programCode]);
                    }

                    const programPage = await context.newPage();
                    await programPage.goto(baseUrl + programUrl + "#requirementstext");
                    const pageTitle = await degreePage.$("#contentarea h1");

                    if (!pageTitle) continue;
                    try {
                        progName = progName.replace(/ *\([^)]*\) */g, "");
                        programs[programCode] = await scrapeProgram(programPage, degreeCode, progName);
                    } catch (error) {
                        console.error(error);
                    }
                    await programPage.close();
                } catch (programError) {
                    console.log(programError);
                }
            }

            await degreePage.close();
        }

        await browser.close();
    } catch (programError) {
        console.error(programError);
    }

    const endTime = new Date().getTime();

    const minutes = Math.floor((endTime - startTime) / 1000 / 60);
    const seconds = Math.floor((endTime - startTime) / 1000) % 60;

    console.log(`Scraping complete. Took ${minutes}m${seconds}s`);

    return { programs, programAbbreviations };
};

export default scrapeUofgPrograms;
