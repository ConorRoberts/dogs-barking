import { ProgramIndex } from "types/Program";
/**
 * @param  {ProgramIndex} programIndex
 */
const printPrograms = (programIndex: ProgramIndex) => {
    let i = 0;

    for (const [key] of Object.entries(programIndex)) {
        i += 1;
        console.log(i + ". " + "[" + key + "]");
    }
    console.log("\nTotal Programs in Degree: " + i);
    return;
};

export default printPrograms;
