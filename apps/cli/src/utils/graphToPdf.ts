import { Graph } from "graphviz";
import { GraphOptions } from "types/Input";
import * as fs from "fs";

/**
 * Creates PDF for based on graph data structure provided
 * @returns 1 on successful write
 * @returns 0 on unsuccessful write
 */
const graphToPdf = (graph: Graph, filename: string): number => {
    // Regex pattern for valid file name
    const fileNameSchema = /[A-z]+\.pdf/g;

    // Check for invalid save file name.
    if (filename && !fileNameSchema.test(filename)) return 0;

    try {
        // Save with custom file name
        if (!fs.existsSync("apps/cli/data/")) fs.mkdirSync("apps/cli/data/");
        graph.output("pdf", "apps/cli/data/" + filename);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
};
export default graphToPdf;
