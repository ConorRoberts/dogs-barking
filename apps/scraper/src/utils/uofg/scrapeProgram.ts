import { Page } from "playwright";
import Program from "@dogs-barking/common/types/Program";
import scrapeProgramSection from "./scrapeProgramSection";

/**
 *
 */
const scrapeProgram = async (page: Page, degreeCode: string, programTitle: string): Promise<Program> => {
    const container = await page.$("div#requirementstextcontainer, div#scheduleofstudiestextcontainer");
    
    if (!container) throw new Error("No container found");
    const elements = await container.$$("table,p,h2,h4,h3");

    const program: Program = {
        degree: degreeCode ?? "None",
        school: "uofg",
        title: programTitle ?? null
    };

    let currentTitle = "major";
    let hasHeading = false;
    
    const majorData = [];
    const minorData = [];
    const areaData = [];
    const restrictedData = [];
    const backupMajorData = [];
    const coreData = [];
    for (const e of elements) {
        const elementType = await (await e.getProperty("localName")).jsonValue();
        if (elementType === "h2" || elementType === "h4" || elementType === "h3") {
            currentTitle = await e.innerText();
            hasHeading = true;
        } else if (elementType === "table") {
            const title = currentTitle.replace(/([0-9]\. )|([0-9]+\.[0-9]+ Credits)|"|-/g, "").trim();
            if ((title.toLowerCase().includes("major") || title.includes("core courses")) && hasHeading) {
                majorData.push(e);
                hasHeading = false;
            } else if (title.toLowerCase().includes("schedule of studies") && hasHeading) {
                backupMajorData.push(e);
                hasHeading = false;
            } else if (title.toLowerCase().includes("minor") && hasHeading) {
                minorData.push(e);
                hasHeading = false;
            } else if (title.toLowerCase().includes("area") && hasHeading) {
                areaData.push(e);
                hasHeading = false;
            } else if (title.toLowerCase().includes("restricted electives") && hasHeading) {
                restrictedData.push(e);
                hasHeading = false;
            } else if (title.toLowerCase().includes("core requirements") && hasHeading) {
                coreData.push(e);
                hasHeading = false;
            }
        }
    }

    if (majorData.length > 0) {
        program.major = await scrapeProgramSection(majorData.slice(0, 1));
    } else {
        program.major = await scrapeProgramSection(majorData.slice(0, 1));
    }

    if (minorData.length > 0) program.minor = await scrapeProgramSection(minorData);

    if (restrictedData.length > 0) program.restricted = await scrapeProgramSection(restrictedData);

    if (areaData.length > 0) program.area = await scrapeProgramSection(areaData);

    return program;
};

export default scrapeProgram;
