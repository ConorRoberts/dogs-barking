import { ProgramIndex } from "types/Program";

/**
 * Query programs with a degree.
 * @param programs: a list of program JSON objects.
 * @param desiredDegree: The degree to search for.
 * @returns: An array of programs.
 */
const programByDegree = (programIndex: ProgramIndex, desiredDegree: string): ProgramIndex => {
    const filteredJSON: ProgramIndex = {};
    //loops through Programs to check if their degree matches with the desired degree
    for (const [key, value] of Object.entries(programIndex)) {
        if (value.degree === desiredDegree) {
            filteredJSON[key] = value;
        }
    }
    return filteredJSON;
};

export default programByDegree;
