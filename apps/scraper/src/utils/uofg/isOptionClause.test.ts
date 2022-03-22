import isOptionClause from "./isOptionClause";

test.only("Long format option clause", () => {
    const str =
        "Select 2.50 additional credits in Classics, 1.00 of which may be taken from the following as part of the program:";
    expect(isOptionClause(str)).toBe(true);
});

test.only("Wrong format", () => {
    const str = "Hello world! This is a test";
    expect(isOptionClause(str)).toBe(false);
});

test.only("from the following format", () => {
    const str = "Select 1.00 credits from the following";
    expect(isOptionClause(str)).toBe(true);
});

test.only("electives or retrictions", () => {
    const str = "1.00 electives or restricted electives";
    expect(isOptionClause(str)).toBe(false);
});
