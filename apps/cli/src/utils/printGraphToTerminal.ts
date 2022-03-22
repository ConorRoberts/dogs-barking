import { Graph } from "graphviz";

/**
 * @param  {number} numOfTabs
 * @returns string
 */
const generateTabs = (numOfTabs: number): string => {
    let tabs = "";

    for (let tabCount = 0; tabCount < numOfTabs; tabCount++) {
        tabs += "---";
    }

    return tabs;
};
/**
 * @param  {Map<string} graphMap
 * @param  {} string[]>
 * @returns string
 */
const getDepartmentCode = (graphMap: Map<string, string[]>): string => {
    /**
     * for (const key of graphMap.keys()) {
        const splitKey: string[] = key.split("*");
        return splitKey[0];
    }
     */
    return "undefined";
};
/**
 * @param  {Map<string} graphMap
 * @param  {} string[]>
 * @param  {number} courseNumber
 * @returns boolean
 */
const courseNumberExistsInGraph = (graphMap: Map<string, string[]>, courseNumber: number): boolean => {
    /**
     *  TODO: Remove downlevel iteration from here
     * for (const key of graphMap.keys()) {
        const keySplit: string[] = key.split("*");

        if (+keySplit[1] === courseNumber) {
            return true;
        }
    }*/
    

    return false;
};
/**
 * @param  {string[]} searchArray
 * @param  {string} searchKey
 * @param  {string} searchVal
 * @returns boolean
 */
const doesValueAlreadyExist = (searchArray: string[], searchKey: string, searchVal: string): boolean => {
    // If, for some ungodly reason, should the searchKey ever equal the searchVal, return true so that the Map isn't updated incorrectly.
    if (searchKey.toLowerCase() === searchVal.toLowerCase()) {
        return true;
    }

    // Otherwise, simply search the prereq array for the specified value, and return true if it is found.
    else {
        for (let i = 0; i < searchArray.length; i++) {
            if (searchArray[i].toLowerCase() === searchVal.toLowerCase()) {
                return true;
            }
        }
    }

    // Return false if the value is not yet in the prereq array.
    return false;
};
/**
 * @param  {Map<string} graphMap
 * @param  {} string[]>
 * @param  {Map<string} refMap
 * @param  {} string[]>
 * @param  {string} currentKey
 * @param  {number} level
 * @returns Map
 */
const printGraph = (
    graphMap: Map<string, string[]>,
    refMap: Map<string, string[]>,
    currentKey: string,
    level: number
): Map<string, string[]> => {
    const tabs = generateTabs(level);

    while (!(graphMap.size === 0)) {
        if (level === 0) {
            console.log("-- " + currentKey);
        } else {
            console.log("\t+" + tabs + " " + currentKey);
        }

        const currentPrereqs: string[] = graphMap.get(currentKey) as string[];

        if (!currentPrereqs || currentPrereqs.length === 0) {
            graphMap.delete(currentKey);
            return graphMap;
        } else {
            for (let i = 0; i < currentPrereqs.length; i++) {
                if (isNaN(+currentPrereqs[i]) == false) {
                    const crossRef: string[] = refMap.get(currentPrereqs[i]) as string[];

                    if (crossRef) {
                        for (let j = 0; j < crossRef.length; j++) {
                            if (graphMap.has(crossRef[j])) {
                                graphMap = printGraph(graphMap, refMap, crossRef[j], level + 1);
                                graphMap.delete(crossRef[j]);
                            }
                        }
                    }

                    graphMap.delete(currentPrereqs[i]);
                } else {
                    graphMap = printGraph(graphMap, refMap, currentPrereqs[i], level + 1);
                    graphMap.delete(currentPrereqs[i]);
                }
            }

            return graphMap;
        }
    }

    return graphMap;
};

/**
 * @param  {Graph} graph
 * @returns Map
 */
const printGraphToTerminal = (graph: Graph) => {
    const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
    const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);
    const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");

    // Matches any number (positive or negative) that has 8 or more digits. This is meant to capture the random id's of generated coreq groups in the graph.
    const coreqIdentifierRegex = new RegExp(/[-]?[0-9]{8,}/g);
    const wordyCoreqRegex = new RegExp(/(?<=label = ).*/g);

    const ourGraph: string = graph.to_dot().replace("digraph G {", "");

    const graphArr: string[] = ourGraph.split(";");
    const size: number = graphArr.length;

    const prereqMap: Map<string, string[]> = new Map<string, string[]>();
    const coreqMap: Map<string, string[]> = new Map<string, string[]>();

    for (let i = 0; i < size; i++) {
        const coreqIDArr: string[] = graphArr[i].match(coreqIdentifierRegex) as string[];
        const resultsArr: string[] = graphArr[i].match(combinedCourseRegex) as string[];
        const wordyCoreqs: string[] = graphArr[i].match(wordyCoreqRegex) as string[];

        if (coreqIDArr && wordyCoreqs) {
            //console.log("coreqID's:\n" + coreqIDArr);

            const coreqWord: string = wordyCoreqs[0].replace(/"/g, "").replace(" ]", "").replace(";", "").trim();
            //console.log("wordy: \n" + coreqWord);

            const currentCoreqs: string[] = coreqWord.split("|") as string[];

            if (currentCoreqs) {
                for (let j = 0; j < currentCoreqs.length; j++) {
                    currentCoreqs[j] = currentCoreqs[j].trim();
                    //console.log("[" + j + "]: " + currentCoreqs[j]);
                    if (!coreqMap.has(coreqIDArr[0])) {
                        coreqMap.set(coreqIDArr[0], currentCoreqs);
                    }
                }
            }
        }

        if (resultsArr) {
            if (resultsArr.length === 1) {
                if (!prereqMap.has(resultsArr[0])) {
                    prereqMap.set(resultsArr[0], [] as string[]);
                }
            }

            if (resultsArr.length === 2) {
                if (!prereqMap.has(resultsArr[1])) {
                    prereqMap.set(resultsArr[1], [] as string[]);
                }

                const currentCoursePrereqs: string[] = prereqMap.get(resultsArr[1]) as string[];

                if (currentCoursePrereqs.length === 0) {
                    currentCoursePrereqs.push(resultsArr[0]);
                } else {
                    if (!doesValueAlreadyExist(currentCoursePrereqs, resultsArr[1], resultsArr[0])) {
                        currentCoursePrereqs.push(resultsArr[0]);
                    }
                }

                prereqMap.set(resultsArr[1], currentCoursePrereqs);
            }

            if (coreqIDArr) {
                // Then we are dealing with a cross-reference to optional prereqs.

                const currentGraphLine: string = graphArr[i] as string;

                // If there is a cross-reference, a coursecode, and an arrow resembling a connection betweeen the two. (Prevents circular references)
                if (resultsArr.length === 1 && coreqIDArr.length === 1 && currentGraphLine.includes("->")) {
                    const currentCoursePrereqs: string[] = prereqMap.get(resultsArr[0]) as string[];
                    currentCoursePrereqs.push(coreqIDArr[0]);

                    prereqMap.set(resultsArr[0], currentCoursePrereqs);
                }
            }
        }
    }

    console.log("------------------------- GRAPH --------------------------");

    const maxCourseLevel = 10000;
    const minCourseLevel = 1000;
    const levelDecrement = 10;

    let workerMap: Map<string, string[]> = new Map(prereqMap);
    const deptCode = getDepartmentCode(workerMap);

    for (
        let currentCourseLevel = maxCourseLevel;
        currentCourseLevel >= minCourseLevel;
        currentCourseLevel -= levelDecrement
    ) {
        if (courseNumberExistsInGraph(workerMap, currentCourseLevel)) {
            if (!(deptCode === "undefined")) {
                const courseKey: string = deptCode + "*" + currentCourseLevel;
                workerMap = printGraph(workerMap, coreqMap, courseKey, 0);
            }
        }
    }

    console.log("----------------------- GRAPH FIN -------------------------");
};

export default printGraphToTerminal;

//const courses: CourseIndex = JSON.parse(readFileSync("./data/courses.json", "utf8"));
//const testGraph = makeGraph(Object.values(courses).filter(e => e.departmentCode === "CIS"));
//printGraphToTerminal(testGraph);
