import { chromium, devices } from "playwright";
//import scrapeProgram from "./scrapeProgram";
import { ProgramIndex } from "types/Program";

const baseUrl = "https://ugradcalendar.uwaterloo.ca";
const startUrl = "/page/uWaterloo-Undergraduate-Calendar-Access";

/**
 *
 */
const scrapeUofgPrograms = async (): Promise<{ programs: ProgramIndex; programAbbreviations: [string, string][] }> => {
    const programAbbreviations: [string, string][] = [];

    //const startTime = new Date().getTime();
    const programs: ProgramIndex = {};

    try {
        const browser = await chromium.launch();

        const context = await browser.newContext({
            ...devices["Desktop Chrome"],
        });

        const page = await context.newPage();

        console.log("Scraping from: " + baseUrl + startUrl);
        await page.goto(baseUrl + startUrl);


        
        await browser.close();
    } catch (programError) {
        console.error(programError);
    }




    return { programs, programAbbreviations };
};

export default scrapeUofgPrograms;