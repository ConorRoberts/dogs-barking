import getAssociatedDepartments from "./getAssociatedDepartments";

test("Empty", () => {
    expect(getAssociatedDepartments("")).toEqual([]);
});

test("Two comma-separated departments", () => {
    expect(getAssociatedDepartments("School of Hospitality, Food and Tourism Management  ")).toEqual([
        "School of Hospitality",
        "Food and Tourism Management",
    ]);
});

test("One department", () => {
    expect(getAssociatedDepartments("School of Hospitality")).toEqual(["School of Hospitality"]);
});
