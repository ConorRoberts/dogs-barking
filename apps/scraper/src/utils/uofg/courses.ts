import { chromium, devices } from "playwright";
import logScrapingProgress from "./logScrapingProgress";
import { CourseIndex } from "@dogs-barking/common/types/Course";
import generateSemesters from "./generateSemesters";
import equatesToArray from "./equatesToArray";
import getLocations from "./getLocations";
import getAssociatedDepartments from "./getAssociatedDepartments";
import getYearsOffered from "./getYearsOffered";
import getCourseCode from "./getCourseCode";
import getClassCounts from "./getClassCounts";
import preReqsToArray from "./preReqsToArray";
import coreqToArray from "./coreqToArray";
import restrictionsToArray from "./restrictionsToArray";

const baseUrl = "https://calendar.uoguelph.ca";
const scraperUrls = ["/undergraduate-calendar/course-descriptions/", "/graduate-calendar/appendix-courses/"];

/**
 *
 */
const scrapeUofgCourses = async (): Promise<CourseIndex> => {
    const courses: CourseIndex = {};
    try {
        const browser = await chromium.launch();

        const context = await browser.newContext({
            ...devices["Desktop Chrome"],
        });

        const startTime = new Date().getTime();
        const page = await context.newPage();

        // Dealing with phase courses
        const phaseArrayMapping = new Map<string, string[]>([
            ["DVM Phase 1", []],
            ["DVM Phase 2", []],
            ["DVM Phase 3", []],
            ["DVM Phase 4", []],
        ]);
        const phaseCalendarMatch = new Map<string, string[]>([
            ["All Phase 1 courses", []],
            ["All Phase 2 courses", []],
            ["All Phase 3 courses", []],
            ["All Phase 4 courses", []],
        ]);

        for (const url of scraperUrls) {
            console.log("Scraping from: " + baseUrl + url);
            await page.goto(baseUrl + url);

            // Get list of items within each alphabetical category
            const departmentLists = await page.$$("div.page_content div.az_sitemap > ul");

            // Get number of departments and initialize index to track current department
            // This will indicate current progress of scraping
            let departmentIndex = 1;
            let departmentCount = 0;
            for (const department of departmentLists) {
                const departments = await department.$$("li");
                departmentCount += departments.length;
            }

            for (const element of departmentLists) {
                const departments = await element.$$("li");

                for (const department of departments) {
                    const linkElement = await department.$("a");

                    if (linkElement === null) continue;

                    const linkHref = await linkElement.getAttribute("href");
                    // Get department page for further scraping
                    const departmentPage = await context.newPage();
                    try {
                        await departmentPage.goto(baseUrl + linkHref);

                        // Get list of courses within department
                        const courseList = await departmentPage.$$("div.courseblock");

                        for (const course of courseList) {
                            try {
                                const courseDataElements = await course.$$("div span strong");

                                const courseCodeText = await courseDataElements[0]?.innerText();
                                const { departmentCode, courseNumber } = getCourseCode(courseCodeText);

                                logScrapingProgress({
                                    departmentIndex,
                                    departmentCount,
                                    courseDepartment: departmentCode,
                                    courseNumber: +courseNumber,
                                });

                                const name = await courseDataElements[1]?.innerText();

                                const semestersOfferedText = await courseDataElements[2]?.innerText();
                                const semestersOffered = generateSemesters(semestersOfferedText);

                                const yearsOfferedElement = await course.$("div:nth-child(3) span span");
                                const yearsOfferedText = await yearsOfferedElement?.innerText();
                                const yearsOffered = getYearsOffered(yearsOfferedText);

                                if (departmentCode === "VETM") {
                                    // semesters offered does not exist for phase courses, instead it tells what phase it is in
                                    const phaseArray = phaseArrayMapping.get(semestersOfferedText) as string[];
                                    phaseArray?.push(courseCodeText);
                                }

                                // Dont need function. This is just a number
                                const creditWeightElement = await courseDataElements[4]?.innerText();
                                const creditWeight = +(creditWeightElement?.match(/[\d.]+/) ?? 0);

                                // Dont need function. This is just a number
                                const classesPerWeekElement = await courseDataElements[3]?.$("span");
                                const classesPerWeekText = await classesPerWeekElement?.innerText();
                                const { labs: labsPerWeek, lectures: lecturesPerWeek } =
                                    getClassCounts(classesPerWeekText);

                                const descriptionElement = await course.$("div:nth-child(2) p");
                                const description = await descriptionElement?.innerText();

                                const prerequisitesElement = await course.$("div:nth-child(5) span span");
                                const prerequisitesText = await prerequisitesElement?.innerText();
                                // VETM special case of phase courses
                                let prerequisites: string[] = [];
                                if (departmentCode === "VETM" && prerequisitesText) {
                                    if (phaseCalendarMatch.has(prerequisitesText)) {
                                        prerequisites = phaseCalendarMatch.get(prerequisitesText) as string[];
                                    }
                                } else {
                                    prerequisites = preReqsToArray(prerequisitesText);
                                }

                                const corequisitesElement = await course.$("div:nth-child(6) span span");
                                const corequisitesText = await corequisitesElement?.innerText();
                                // VETM special case of phase courses
                                let corequisites: string[] = [];
                                if (departmentCode === "VETM" && corequisitesText) {
                                    if (phaseCalendarMatch.has(corequisitesText)) {
                                        corequisites = phaseCalendarMatch.get(corequisitesText) as string[];
                                    }
                                } else {
                                    corequisites = coreqToArray(corequisitesText);
                                }

                                const equatesElement = await course.$("div:nth-child(7) span span");
                                const equatesText = await equatesElement?.innerText();
                                const equates = equatesToArray(equatesText);

                                const restrictionsElement = await course.$("div:nth-child(8) span span");
                                const restrictionsText = await restrictionsElement?.innerText();
                                // const restrictions = restrictionsText ?? "";
                                const restrictions = restrictionsToArray(restrictionsText);

                                const associatedDepartmentsElement = await course.$("div:nth-child(9) span span");
                                const associatedDepartmentsText = await associatedDepartmentsElement?.innerText();
                                const associatedDepartments = getAssociatedDepartments(associatedDepartmentsText);

                                const locationsElement = await course.$("div:nth-child(10) span span");
                                const locationsText = await locationsElement?.innerText();
                                const locations = getLocations(locationsText);

                                courses[`${departmentCode}*${courseNumber}`] = {
                                    courseName: name,
                                    courseNumber: +courseNumber,
                                    departmentCode,
                                    semestersOffered,
                                    creditWeight,
                                    description: description ?? "",
                                    location: locations,
                                    prerequisites,
                                    corequisites,
                                    lecturesPerWeek,
                                    labsPerWeek,
                                    equates,
                                    restrictions,
                                    associatedDepartments,
                                    yearsOffered,
                                    school: "UofG",
                                };
                            } catch (departmentError) {
                                console.log(departmentError);
                            }
                        }

                        departmentIndex++;
                        await departmentPage.close();
                    } catch (redirectError) {
                        console.log(redirectError);
                    }
                }
            }
        }

        await browser.close();

        const endTime = new Date().getTime();

        const minutes = Math.floor((endTime - startTime) / 1000 / 60);
        const seconds = Math.floor((endTime - startTime) / 1000) % 60;

        console.log(`Scraping complete. Took ${minutes}m${seconds}s`);

        return courses;
    } catch (programError) {
        console.error(programError);
    }

    return courses;
};

export default scrapeUofgCourses;
