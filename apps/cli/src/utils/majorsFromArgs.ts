/**
 * Extracts all majors from arguments
 * 
 * @param args Array of arguments
 * @param index Index of first argument after '-program'
 * @returns String array of major names
 */
const majorsFromArgs = (args : string[], index : number) => {
    let majors:string[] = [];
    if (args && index >= 0) {
        let i = index;
        while (i < args.length && !args[i].includes("-")) {
            majors.push(args[i]);
            i++;
        }
    }
    return majors;
}

export default majorsFromArgs;