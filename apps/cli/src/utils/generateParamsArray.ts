/**
 * Takes command line arguments, splits them into the command, and a list of parameters
 * @param args -> the arguments to be read in
 * @param modifier -> the type of arguments we are reading in
 * @param index -> the index to start at
 * @returns -> array form of the arguments between flags
 */
const generateParamsArray = (
    args: string[],
    modifier: string,
    index: number
) => {
    const parameters: string[] = [];
    const length = args.length;
    let tempArg;
    let iterations = 0;
    while (index < length && !args[index].includes("-")) {
        if (
            (modifier === "semester" && args[index].length !== 1) || iterations === 3
        ) {
            // semester argument parsing
            break;
        }
        if (args[index].match(/[0-9]{2}.[0-9]{2}/g) && modifier === "prq") {
            // next arg is assumed to be 'credits'
            tempArg = args[index];
            const joinedArg = tempArg.concat(" credits");
            parameters.push(joinedArg);
            index++;
        } else {
            parameters.push(args[index]);
        }
        index++;
        modifier === "semester" ? iterations++ : null;
    }
    return parameters;
};
export default generateParamsArray;
