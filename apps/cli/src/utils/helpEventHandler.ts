/**
 * looks specifically for the -h flag and displays information about each flag/query type
 * flags and their respective descriptions are stored in help.json
 */
import queryHelp from "config/queryHelp";
import graphHelp from "config/graphHelp";

const helpEventHandler = (command: string) => {
    const help = command === "query" ? queryHelp : graphHelp;
    console.log("Usage: " + help.usage + "\n");
    console.log("----COMMANDS/FLAGS---- \n");
    for (let i = 0; i < help.commands.length; i++) {
        const command = help.commands[i];
        const description = help.cmddescriptions[i];
        console.log(command + ": \t\t" + description);
    }
    console.log("\n----QUERY TYPES---- \n");
    for (let i = 0; i < help.querytypes.length; i++) {
        const command = help.querytypes[i];
        const description = help.querydesc[i];
        console.log(command + ": \t\t" + description);
    }
}; 
export default helpEventHandler;