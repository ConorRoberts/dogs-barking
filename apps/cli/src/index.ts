import * as readline from "readline";
import parseInput from "utils/parseInput";
import helpEventHandler from "utils/helpEventHandler";
import getQueryResults from "utils/getQueryResults";
import executeQuery from "utils/executeQuery";
import makeGraph from "utils/makeGraph";
import printGraphToTerminal from "utils/printGraphToTerminal";
import graphToPdf from "utils/graphToPdf";
import printDetailedCourses from "utils/printDetailedCourses";
import printCourses from "utils/printCourses";
import printPrograms from "utils/printPrograms";
import getQueryProgram from "utils/getQueryProgram";
import graphProgram from "utils/graphProgram";
import mergePdf from "utils/mergePdf";
import { Graph } from "graphviz";
import { ProgramIndex } from "@dogs-barking/common/types/Program";
import { readFileSync } from "fs";
import { CourseIndex } from "@dogs-barking/common/types/Course";

const testJSON = JSON.parse(readFileSync("./packages/data/courses.json", "utf8")) as CourseIndex;
const ProgramJSON = JSON.parse(readFileSync("./packages/data/programs.json", "utf8")) as ProgramIndex;
//const testJSON = JSON.parse(readFileSync("data/courses.json", "utf-8")) as CourseIndex;
/**
 * Main/Driver code for query
 * takes scraped course data in and runs a command loop
 */
const query = () => {
    console.log("Enter a command");
    
    const line = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Array of pdf names created within program runtime
    let filenames:string[] = [];

    line.on("line", (input) => {
        const parsedInput = parseInput(input);

        if (input.includes("exit") || input === "e") { // exit on e or exit input
            process.exit(0);
        }

        let programs: ProgramIndex = ProgramJSON;

        switch (parsedInput.school) {
            case "uoft":
                programs = Object.fromEntries(Object.entries(programs).filter((e) => e[1].school !== "uofg"));
                //console.log(programs);
                break;
            case "uofg":
                programs = Object.fromEntries(Object.entries(programs).filter((e) =>  e[1].school === "uofg"));
                break;
        }
        //console.log(programs);

        if (parsedInput.help && parsedInput.Command !== "-h") {
            helpEventHandler(parsedInput.Command);
        } else if (parsedInput.Command === "query") {
            if (!(parsedInput.QueryTypes.degree === "")) {
                const queryResults = getQueryProgram(parsedInput, programs);
                printPrograms(queryResults);
            } else {
                const queryOptions = parsedInput.QueryTypes.options;
                const queryResults = getQueryResults(parsedInput, testJSON, queryOptions);
                parsedInput.QueryTypes.options.PrintMode === "Detailed" ? printDetailedCourses(queryResults) : printCourses(queryResults);
            }
        } else if (parsedInput.Command === "makegraph") {
            const graphOptions = parsedInput.Graph;
            const searchData = executeQuery(parsedInput.QueryTypes, Object.values(testJSON));
            let graphs: Graph[] = [];
            if (parsedInput.Graph.graphType === "Program") {
                if (parsedInput.Graph.graphMajor.includes("all")) {
                    //console.log(Object.keys(programJSON));

                    for (const major of Object.keys(programs)) {
                        //console.log(major);
                        if (major === "") {
                            continue;
                        }
                        if (programs[major]) {
                            graphs.push(graphProgram(
                                programs[major],
                                parsedInput.Graph,
                                major,
                                testJSON
                            ));
                        } else {
                            console.log("Invalid Major: " + major + " (won't be graphed)");
                        }
                    }
                }else {
                    for (const major of parsedInput.Graph.graphMajor) {
                        if (major === "") {
                            continue;
                        }
                        console.log(programs[major]);
                        if (programs[major]) {
                            graphs.push(graphProgram(
                                programs[major],
                                parsedInput.Graph,
                                major,
                                testJSON
                            ));
                        } else {
                            console.log("Invalid Major: " + major + " (won't be graphed)");
                        }
                    }
                }
            } else {
                graphs.push(makeGraph(searchData, graphOptions));
            }

            if (graphOptions.terminal) {
                // verbose mode
                graphs ? printGraphToTerminal(graphs[0]) : null;
            } else {
                //Output graph data structure to PDF
                let writePdf = 0;
                for (const graph of graphs) {
                    const graphName = graph.get("label");
                    let fileName = "";
                    graphName 
                        ? fileName = graphName.toString().replace(/\s/g, "").replace(":","_") + "_" + graphOptions.saveAs 
                        : fileName = graphOptions.saveAs;
                    
                    graphs ? (writePdf = graphToPdf(graph, fileName)) : 0;

                    if (writePdf) {
                        filenames.push("apps/cli/data/" + fileName);
                        console.log("successfully written to " + fileName);
                    } else {
                        console.log("write to " + fileName + " failed");
                    }
                }
            }
            setTimeout(() => { // delay when printing the entire school bro
                if (parsedInput.Graph.mergePdf) {
                    mergePdf(filenames, parsedInput.Graph.saveAs);
                }
            }, 2500);
            
        } else {
            console.log("Invalid usage -> use [query/makegraph] -h for more information");
        }

        console.log("Enter a command");
        
    });
    line.on("SIGINT", () => {
        console.log("Exiting program");
        process.exit(0);
    });
};

query();

export default query;
