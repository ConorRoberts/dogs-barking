import { ElementHandle } from "playwright";
import { ProgramIndex } from "@dogs-barking/common/types/Program";
import Section from "@dogs-barking/common/types/Section";

const uotCourseCodeRegex = new RegExp(/[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?/g);
const creditHeading = new RegExp(/\((\d{1}|\d{2})(\.(\d{1}))? credits\)/g);
const notesHeading = new RegExp(/^([ ]+)?((Notes)|(notes)):/g);

const courseCodeAND = new RegExp(/[ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?,[ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?/g);
const courseCodeANDWithBrackets = new RegExp(/\([ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?,[ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?\)/g);
const courseCodeOR = new RegExp(/[ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?\/[ ]?[A-Z]{3}(\d{3}|\d{4})(H|Y)(F|S|Y)?(\d{1})?;?/g);

const optionClause = new RegExp(/((\d{1}|\d{2})\. )?complete (\d{1}|\d{2})\.\d{1} credit[s]?.*(following)?/g);
const optionTargetWeight = new RegExp(/((\d{1}|\d{2})\.)(\d{1}|\d{2})/g);

const numericLine = new RegExp(/^\d.[ ]?/g);

const FIRST_YEAR: string = "First Year:";
const SECOND_YEAR: string = "Second Year:";
const THIRD_YEAR: string = "Third Year:";
const FOURTH_YEAR: string = "Fourth Year:";
const HIGHER_YEARS: string = "Higher Years:";

const YEAR_ONE: string = "Year 1:";
const YEAR_TWO: string = "Year 2:";
const YEAR_THREE: string = "Year 3:";
const YEAR_FOUR: string = "Year 4:";

let inFirstYear: boolean = true; // To begin, assume that we are in first year.
let inSecondYear: boolean, inThirdYear: boolean, inFourthYear: boolean, inHigherYears: boolean = false;


const programs: ProgramIndex = {};

const resetSectionFlags = () => {
    inFirstYear = true;
    inSecondYear = false;
    inThirdYear = false;
    inFourthYear = false;
    inHigherYears = false;
};

const setSection = (currentHeading: string) => {
    switch (currentHeading) {
        case FIRST_YEAR.toLowerCase() || YEAR_ONE.toLowerCase():
            inFirstYear = true;
            inSecondYear = false;
            inThirdYear = false;
            inFourthYear = false;
            inHigherYears = false;
            return true;
        case SECOND_YEAR.toLowerCase() || YEAR_TWO.toLowerCase():
            inFirstYear = false;
            inSecondYear = true;
            inThirdYear = false;
            inFourthYear = false;
            inHigherYears = false;
            return true;
        case THIRD_YEAR.toLowerCase() || YEAR_THREE.toLowerCase():
            inFirstYear = false;
            inSecondYear = false;
            inThirdYear = true;
            inFourthYear = false;
            inHigherYears = false;
            return true;
        case FOURTH_YEAR.toLowerCase() || YEAR_FOUR.toLowerCase():
            inFirstYear = false;
            inSecondYear = false;
            inThirdYear = false;
            inFourthYear = true;
            inHigherYears = false;
            return true;
        case HIGHER_YEARS.toLowerCase() || currentHeading.toLowerCase().includes("higher years"): // For combination of "Year 2 and Higher Years". Just treat as higher years.
            inFirstYear = false;
            inSecondYear = false;
            inThirdYear = false;
            inFourthYear = false;
            inHigherYears = true;
            return true;
        default:
            return false;
    }
};

const getSection = (): string => {
    if (inFirstYear) {
        return FIRST_YEAR.replace(":", "");
    }
    else if (inSecondYear) {
        return SECOND_YEAR.replace(":", "");
    }
    else if (inThirdYear) {
        return THIRD_YEAR.replace(":", "");
    }
    else if (inFourthYear) {
        return FOURTH_YEAR.replace(":", "");
    }
    else if (inHigherYears) {
        return HIGHER_YEARS.replace(":", "");
    }

    return "error.";
};

export const formatCoursesLine = (input: string): string[] => {
    // const result: string[] = [];
    // const filteredInput = input.match(/\(?[A-Z]{3}[0-9]{3}[A-Z][0-9].*[A-Z]{3}[0-9]{3}[A-Z][0-9]\)?/) ?? [];

    // if (filteredInput.length === 0)
    //     return [];

    // filteredInput[0].split(";")
    //     .forEach((e) => {
    //         let str = e
    //             .replace(/[\u200B-\u200D\uFEFF]/g, "")
    //             .replace(/,|(and)/g, " & ")
    //             .replace(/\*/g, "")
    //             .replace(/\//g, " / ")
    //             .replace(/\( /g, "(")
    //             .replace(/ \)/g, ")")
    //             .replace(/ {2}/g, " ")
    //             .trim();

    //         // Check for some garbage in there
    //         if (/\([0-9]\)/g.test(str)) {
    //             str = str.replace(/\([0-9]*\)/g, "").trim();
    //         }

    //         if (/\(|\)|\//g.test(str)) {
    //             result.push(str);
    //         } else {
    //             result.push(...str.replace(/ +/g, "").split("&"));
    //         }
    //     });

    // return result;
    return input.split(";").map((e) => (e.trim().match(/[A-Z]{3}[0-9]{3}[A-Z][0-9]/g) ?? []).join(" / ")).filter((e) => e.length > 0).slice(0, 5);
};

const parseRequirements = (unsanitizedLines: string[]): Section => {
    const programSection: Section = { courses: [], options: [], } as Section;

    for (let unsanitizedLine of unsanitizedLines) {
        const courseCodes = unsanitizedLine.match(uotCourseCodeRegex) ?? [];

        if (unsanitizedLine.toLowerCase().match(creditHeading) || unsanitizedLine.match(notesHeading) || unsanitizedLine[0] === "*") {
            continue;
        }
        else {
            setSection(unsanitizedLine);
        }

        const lineNumber = unsanitizedLine.match(numericLine);
        if (lineNumber) {
            const lineDelim = lineNumber[0];
            unsanitizedLine = unsanitizedLine.replace(lineDelim, "");
        }

        if (!courseCodes) {
            if ((unsanitizedLine.includes("any") && unsanitizedLine.includes("credits")) || unsanitizedLine.includes("credits")) {
                let weight = 0.0;

                const targetWeights = unsanitizedLine.match(optionTargetWeight) as string[];

                if (targetWeights) {
                    if (targetWeights[0]) {
                        weight = +targetWeights[0];
                    }
                }

                programSection.options.push({ courses: [], text: unsanitizedLine, targetWeight: weight, level: 0, dpt: "" });
            }

            continue;
        }
        else {
            const numCourseCodesInLine = courseCodes.length;

            // Then there is at least one course code in the requirement line.
            if (numCourseCodesInLine === 1) { // Then there is only one course code in the line.
                programSection.courses.push({ course: courseCodes[0], section: getSection(), });
            }
            else { // Then there are two ar more course codes in the line.
                if (numCourseCodesInLine === 2) { // Then we need to check for "AND" and "OR" cases.
                    if (unsanitizedLine.match(courseCodeANDWithBrackets) || unsanitizedLine.match(courseCodeAND)) {
                        programSection.courses.push({ course: courseCodes[0] + " & " + courseCodes[1], section: getSection(), });
                    }
                    else if (unsanitizedLine.match(courseCodeOR)) {
                        programSection.courses.push({ course: courseCodes[0] + " / " + courseCodes[1], section: getSection(), });
                    }
                }
                else { // Then our line has three or more course codes and could be more complex. We should probably parse it char by char, or combine some of the existing regexes above to hopefully catch complex cases.
                    if (unsanitizedLine.match(optionClause)) {
                        let requirementText: string = unsanitizedLine.split(":")[0];
                        const optionWeight: string[] = unsanitizedLine.match(optionTargetWeight) as string[];

                        if (requirementText[0] == "(") {
                            requirementText = requirementText.slice(1);
                        }
                        if (requirementText[requirementText.length - 1] === ")") {
                            requirementText = requirementText.slice(0, requirementText.length - 1);
                        }

                        programSection.options.push({ courses: courseCodes, text: requirementText, targetWeight: +optionWeight[0], level: 0, dpt: "" });
                    }
                    else {
                        const coursesToAdd: string[] = formatCoursesLine(unsanitizedLine);

                        for (const c of coursesToAdd) {
                            programSection.courses.push({ course: c, section: getSection(), });
                        }
                    }
                }
            }
        }
    }

    return programSection;
};

const scrapeProgram = async (programRows: ElementHandle[]): Promise<ProgramIndex> => {
    const programs: ProgramIndex = {};

    let isMajorProgram = true;
    let isMinorProgram = false;
    let isAreaProgram = false;

    for (const programRow of programRows) {
        try {
            // h3 contains the program name, so retrieve it.
            const programHeader = await programRow.$eval("h3", (element) => element.innerText);

            const [programTitle, programCode] = programHeader.split("-").map((element) => element.trim());
            if (!programCode || uotCourseCodeRegex.test(programTitle)) {
                continue;
            }
            else {
                resetSectionFlags();

                if (programTitle) {
                    if (programTitle.toLowerCase().includes("major")) {
                        isMajorProgram = true;
                        isMinorProgram = false;
                        isAreaProgram = false;
                    }
                    else if (programTitle.toLowerCase().includes("minor")) {
                        isMajorProgram = false;
                        isMinorProgram = true;
                        isAreaProgram = false;
                    }
                    else if (programTitle.toLowerCase().includes("focus")) {
                        isMajorProgram = false;
                        isMinorProgram = false;
                        isAreaProgram = true;
                    }
                }

                const completionContent = await programRow.$$("div.views-field-field-completion-requirements div.field-content > p");

                let programSection: Section = {} as Section;
                const headingTexts: string[] = [];

                for (const contentElement of completionContent) {
                    const contentText = await contentElement.innerText();

                    headingTexts.push(contentText);
                }

                programSection = parseRequirements(headingTexts);

                // Build the object based on the type of commendation it rewards upon completion...
                if (isMajorProgram) {
                    programs[programCode] = {
                        degree: programTitle,
                        major: programSection,
                    };
                }
                else if (isMinorProgram) {
                    programs[programCode] = {
                        degree: programTitle,
                        minor: programSection,
                    };
                }
                else if (isAreaProgram) {
                    programs[programCode] = {
                        degree: programTitle,
                        area: programSection,
                    };
                }
            }

        }
        catch (scrapeError) {
            console.log(scrapeError);
        }

    }

    return programs;
};

export default scrapeProgram;