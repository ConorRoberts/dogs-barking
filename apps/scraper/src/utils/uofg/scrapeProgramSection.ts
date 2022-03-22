import { ElementHandle } from "playwright";
import isOptionClause from "./isOptionClause";
import extractOptionClauses from "./extractOptionClauses";
import Option from "@dogs-barking/common/types/Option";
import Section from "@dogs-barking/common/types/Section";
import fixAbbreviations from "./fixAbbreviations";
// import { CourseIndex } from "types/Course";
// import courses from "data/courses.json";

/**
 *
 */
const scrapeProgramSection = async (elements: ElementHandle[]): Promise<Section | undefined> => {
    if (elements.length === 0) return undefined;

    // const { data }: { data: CourseIndex } = await axios.get("/api/scrape/courses");
    // const courseArray = Object.values(data);

    const rows = [];

    for (const e of elements) rows.push(...(await e.$$("tbody > tr")));

    const major: Section = {
        courses: [],
        options: [],
    };

    let optionIndex = -1,
        scrapingOption = false;
    let section = undefined,
        subsection = undefined;
    let rowIndex = 0,
        skipRowCount = 0;

    for (const row of rows) {
        if (skipRowCount > 0) {
            skipRowCount--;
            continue;
        }

        const courseCodes = [];

        const courseCodeElement = await row.$("td.codecol a");
        const courseCode = await courseCodeElement?.innerText();

        if (courseCode) courseCodes.push(courseCode);

        let foundAdditionalCourse = false;

        do {
            const nextRow = rows.at(rowIndex + 1);
            if (nextRow) {
                const nextClasses = await nextRow.getAttribute("class");
                if (nextClasses?.includes("orclass")) {
                    const courseCodeElement = await nextRow.$("td.codecol a");
                    const courseCode = await courseCodeElement?.innerText();
                    if (!courseCode) break;

                    courseCodes.push(courseCode);
                    skipRowCount++;
                    rowIndex++;
                    foundAdditionalCourse = true;
                } else {
                    foundAdditionalCourse = false;
                }
            } else {
                foundAdditionalCourse = false;
            }
        } while (foundAdditionalCourse);

        const headerElement = await row.$("td span.areaheader");
        if (headerElement) section = await headerElement.innerText();

        const streamElement = await row.$("td span.areasubheader");
        // const altStreamElement = await row.$("td span.aresubheader.undefined");

        if (streamElement) subsection = await streamElement.innerText();

        const commentElement = await row.$("td span.courselistcomment");
        let comment = commentElement ? await commentElement.innerText() : null;

        if (courseCodes.length > 0) {
            if (courseCodes.length > 1) {
                // Treat this as an option clause since there are multiple course codes
                major.courses.push({
                    course: courseCodes.join(" / "),
                });
            } else {
                // We have one course
                if (optionIndex >= 0 && scrapingOption) {
                    // Add courses to current option
                    major.options[optionIndex].courses.push(courseCodes.join(" / "));
                } else {
                    // Add coures straight to major
                    major.courses.push({
                        course: courseCodes?.at(0),
                        section,
                        subsection,
                    });
                }
            }
        } else if (comment) {
            const optionClause = await isOptionClause(comment);

            scrapingOption = true;

            // We found a new option clause
            if (optionClause) {
                // if (optionIndex >= 0 && major.options[optionIndex].courses.length === 0) {
                //     const department = major.options[optionIndex].text?.match(/[A-Z]+/g)?.at(0);

                //     major.options[optionIndex].courses = courseArray
                //         .filter((course) => course.departmentCode === department)
                //         .map((course) => course.departmentCode + "*" + course.courseNumber);
                // }

                comment = fixAbbreviations(comment);

                const clauses = extractOptionClauses(comment);

                comment = comment.replace(" and ", " & ");
                //console.log(comment);

                for (const { weight, dpt, level } of clauses) {
                    const option: Option = {
                        targetWeight: weight,
                        courses: [],
                        text: comment,
                        dpt,
                        level,
                    };

                    optionIndex++;

                    // if (dpt !== "following") {
                    //     option.useAnyCourse = true;
                    // }
                    // Then we need to include courses from multiple departments.
                    // else if (dpt.includes(" and ")) {
                    // const dpts: string[] = dpt.split(" and ");
                    // dpt = dpt.replace(" and ", " & ");
                    // for (const d of dpts) {
                    //     option.courses.push(
                    //         ...courseArray
                    //             .filter((course) => course.departmentCode === d && course.courseNumber >= level)
                    //             .map((course) => course.departmentCode + "*" + course.courseNumber)
                    //     );
                    // }
                    // }

                    major.options.push(option);
                }
            } else {
                scrapingOption = false;
            }
        }

        rowIndex++;
    }

    const badCourseCodes: string[] = [];

    for (const option of major.options) {
        if (option.text) {
            if (option.text.toLowerCase().includes("language")) {
                // Then we need to separate the language courses into this option.
                for (const courseObj of major.courses) {
                    if (courseObj.section?.toLowerCase().includes("language")) {
                        if (courseObj.course) {
                            option.courses.push(courseObj.course);
                            badCourseCodes.push(courseObj.course);
                        }
                    }
                }
            } else if (option.text.toLowerCase().includes("group")) {
                for (const courseObj of major.courses) {
                    if (courseObj.subsection?.toLowerCase().includes("group")) {
                        if (courseObj.course) {
                            option.courses.push(courseObj.course);
                            badCourseCodes.push(courseObj.course);
                        }
                    }
                }
            }
        }
    }

    if (badCourseCodes != []) {
        major.courses = major.courses.filter((course) => badCourseCodes.indexOf(course.course as string) === -1);
    }

    return major;
};

export default scrapeProgramSection;
