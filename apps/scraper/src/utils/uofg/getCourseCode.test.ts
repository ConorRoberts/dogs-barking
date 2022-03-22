import getCourseCode from "./getCourseCode";

test("Returns expected value with expected input", () => {
    expect(getCourseCode("CIS*2500")).toStrictEqual({ courseNumber: 2500, departmentCode: "CIS" });
    expect(getCourseCode("VETM*4750")).toStrictEqual({ courseNumber: 4750, departmentCode: "VETM" });
});

test("Handles edge case input without * separator", () => {
    expect(getCourseCode("SOC1500")).toStrictEqual({ courseNumber: 1500, departmentCode: "SOC" });
});
