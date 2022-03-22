import coreqToArray from "./coreqToArray";

test("PHASE COURSES", () => {
    expect(coreqToArray("All Phase 1 courses ")).toEqual(["All Phase 1 courses"]);
});
test("MULTIPLE COURSES", () => {
    expect(coreqToArray("FRHD*3180, FRHD*3400 ")).toEqual(["FRHD*3180", "FRHD*3400"]);
});
test("COURSE or COURSE", () => {
    expect(coreqToArray("ZOO*3210 or ZOO*3620 ")).toEqual(["ZOO*3210 / ZOO*3620"]);
});
test("COURSE", () => {
    expect(coreqToArray("ZOO*4910 ")).toEqual(["ZOO*4910"]);
});
test("OPTIONAL COREQ", () => {
    expect(coreqToArray("SART*1060 can be taken as co-requisite ")).toEqual(["SART*1060 *OPTIONAL*"]);
});
test("NULL", () => {
    expect(coreqToArray("")).toEqual([]);
});
