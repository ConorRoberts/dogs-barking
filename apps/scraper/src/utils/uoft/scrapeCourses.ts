import { ElementHandle } from "playwright";
import { CourseIndex, YearsOffered } from "@dogs-barking/common/types/Course";
import getCreditWeight from "./getCreditWeight";
import getSemestersOffered from "./getSemestersOffered";

/**
 * Given a list of rows that contain course data, return a CourseIndex containing all the courses.
 * 
 * @param rows A list of rows that contain course data.
 * @return A CourseIndex containing all the courses.
 */
const scrapeCourses = async (rows: ElementHandle[]): Promise<CourseIndex> => {
    const uoftCourseCode = /[A-Z]{3}[0-9]{3}[A-Z][0-9]/g;

    const courses: CourseIndex = {};

    for (const row of rows) {
        try {
            // Get the row name
            const courseHeader = await row.$eval("h3", (e) => e.innerText);

            const [courseCodeText, courseName] = courseHeader.split("-").map((e) => e.trim());
            if (!courseCodeText) continue;

            const departmentCode = courseCodeText.substring(0, 3);
            const courseNumber = courseCodeText.substring(3, 6);
            const creditWeight = getCreditWeight(courseCodeText.substring(6, 7));
            const semestersOffered = getSemestersOffered(courseCodeText.substring(7, 8));
            const prerequisitesElement = await row.$("span.views-field-field-prerequisite span.field-content");
            const prerequisitesText = await prerequisitesElement?.innerText();
            const prerequisites = prerequisitesText?.match(uoftCourseCode) ?? [];

            const descriptionElement = await row.$("div.views-field-body > div.field-content > p");
            const description = await descriptionElement?.textContent() ?? "";

            const corequisites: string[] = [];
            const restrictions: string[] = [];
            const yearsOffered: YearsOffered = "all";
            const associatedDepartments = [""];
            const labsPerWeek = 0;
            const equates: string[] = [];
            const location = "St. George";

            courses[courseCodeText] = {
                courseNumber: parseInt(courseNumber),
                creditWeight,
                departmentCode,
                semestersOffered,
                description,
                courseName,
                prerequisites,
                corequisites,
                restrictions,
                yearsOffered,
                labsPerWeek,
                associatedDepartments,
                equates,
                location,
                school: "UofT"
            };

        } catch (error) {
            console.error(error);
        }
    }

    return courses;
};

export default scrapeCourses;