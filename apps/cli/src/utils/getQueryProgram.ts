import Input, { Query } from "types/Input";
import { ProgramIndex } from "types/Program";
import programByDegree from "../programByDegree";

/**
 * @param  {Input} parsedInput
 * @param  {ProgramIndex} testJSON
 * @param  {string[]} flags
 */
const queryProgram = (parsedInput: Input, programJSON: ProgramIndex) => {
    const queryTypes: Query = parsedInput.QueryTypes;
    const results = programByDegree(programJSON, queryTypes.degree);

    return results;
};
export default queryProgram;
