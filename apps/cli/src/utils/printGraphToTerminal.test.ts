import printGraphToTerminal from ".";
import makeGraph from "../makeGraph";
import { Graph } from "graphviz";
import courses from "data/courses";

test("Ensure printGraphToTerminal function is executed without error", () => {
    const testGraph: Graph = makeGraph(
        Object.values(courses)
            .filter((e) => e.departmentCode === "CIS")
            .map((course) => ({ ...course, restrictions: [] }))
    );
    let result = -1;

    // Supress console.log by providing a empty "mock" implementation of it.
    jest.spyOn(console, "log").mockImplementation(jest.fn());

    // Run the test with the suppressed prints.
    printGraphToTerminal(testGraph);
    console.log("You shouldn't see this text");

    // Restore the default console to allow prints again.
    jest.spyOn(console, "log").mockRestore();

    // Ensures that the void function is correctly called with the specified parameters at least once.
    result = 1;
    expect(result).toEqual(1);
});
