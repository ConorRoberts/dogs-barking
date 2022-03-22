import Input from "types/Input";
import parseGraphOptions from "../parseGraphOptions";
import parseQueryOptions from "../parseQueryOptions";

/**
 * More refined argument parser, takes input, breaks into search parameters, flags, query types
 * Takes user input, updates global flags used
 * @param userinput -> A string containing the users input
 * @returns (Input) -> Object containing all input parameters
 */
const parseInput = (userInput: string): Input => {
    // WE OUT HERE WRITING CLEAN CODE ONLI 2022 BABY
    let tmpSchool = "uofg";
    if (userInput.includes("uoft")) {
        tmpSchool = "uoft";
        userInput = userInput.replace("uoft","");
    } else if (userInput.includes("uofg")) {
        userInput = userInput.replace("uofg","");
    }

    const argInput: Input = {
        Command: userInput ? userInput.split(" ")[0]: "",
        QueryTypes: parseQueryOptions(userInput),
        Graph: parseGraphOptions(userInput, tmpSchool),
        help: userInput.includes("-h"),
        school: tmpSchool,
    };
    //console.log(argInput);
    return argInput;
};

export default parseInput;
