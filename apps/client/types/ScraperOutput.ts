import { CourseIndex } from "./Course";
import { ProgramIndex } from "./Program";

type ScraperOutput = {
    courses: CourseIndex;
    programs: ProgramIndex;
    programAbbreviations: [string, string][];
}

export default ScraperOutput;