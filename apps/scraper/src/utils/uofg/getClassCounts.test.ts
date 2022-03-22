import getClassCounts from "./getClassCounts";

test("LAB, LEC", () => {
    expect(getClassCounts("(LAB:3,LEC:3)")).toStrictEqual({ labs: 3, lectures: 3 });
});
test("LEC, LAB", () => {
    expect(getClassCounts("(LEC:3,LAB:13)")).toStrictEqual({ labs: 13, lectures: 3 });
});
test("LEC", () => {
    expect(getClassCounts("(LEC:3)")).toStrictEqual({ labs: 0, lectures: 3 });
});
test("LAB", () => {
    expect(getClassCounts("(LAB:3)")).toStrictEqual({ labs: 3, lectures: 0 });
});
test("LAB (alternate case)", () => {
    expect(getClassCounts("(lab:3)")).toStrictEqual({ labs: 3, lectures: 0 });
});
test("Neither present", () => {
    expect(getClassCounts("")).toStrictEqual({ labs: 0, lectures: 0 });
});
