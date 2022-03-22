import generateSemesters from "./generateSemesters";

test("WINTER", () => {
    expect(generateSemesters("Organic Chemistry III  Winter Only")).toEqual(["W"]);
});
test("FALL", () => {
    expect(generateSemesters("Synthetic Organic Chemistry  Fall Only")).toEqual(["F"]);
});
test("ALL SEMESTERS", () => {
    expect(generateSemesters("CHEM*2400  Analytical Chemistry I  Summer, Fall, and Winter ")).toEqual(["F", "W", "S"]);
});
