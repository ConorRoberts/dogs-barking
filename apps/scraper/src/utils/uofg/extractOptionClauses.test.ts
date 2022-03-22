import extractOptionClauses from "./extractOptionClauses";

test("Select 2.50 additional credits in Classics, 1.00 of which may be taken from the following as part of the program:", () => {
    const str =
        "Select 2.50 additional credits in Classics, 1.00 of which may be taken from the following as part of the program:";

    const expected = extractOptionClauses(str);

    expect(expected).toStrictEqual([
        { weight: 2.5, dpt: "CLAS", level: -1 },
        { weight: 1, dpt: "following", level: -1 },
    ]);
});

test("4.00 additional credits in SOC and SOAN courses, including at least 1.50 credits at the 4000 level", () => {
    const str = "4.00 additional credits in SOC and SOAN courses, including at least 1.50 credits at the 4000 level";

    const expected = extractOptionClauses(str);

    expect(expected).toStrictEqual([{ weight: 4.0, dpt: "SOC and SOAN", level: -1 }]);
});

test("Select 1.00 credits from the following", () => {
    const str = "Select 1.00 credits from the following";

    const expected = extractOptionClauses(str);

    expect(expected).toStrictEqual([{ weight: 1, dpt: "following", level: -1 }]);
});
