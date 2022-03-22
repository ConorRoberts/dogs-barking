import preReqsToArray from "./preReqsToArray";

test("COURSE or COURSE", () => {
    expect(preReqsToArray("ACCT*1220 or ACCT*2220 ")).toEqual(["ACCT*1220 / ACCT*2220"]);
});

test("COURSE", () => {
    expect(preReqsToArray("ACCT*2230  ")).toEqual(["ACCT*2230"]);
});

test("COURSE or COURSE, COURSE or COURSE", () => {
    expect(preReqsToArray("(ACCT*3330 or BUS*3330), (ACCT*3340 or BUS*3340)  ")).toEqual([
        "ACCT*3330 / BUS*3330",
        "ACCT*3340 / BUS*3340",
    ]);
});

test("15.00 credits including...", () => {
    expect(preReqsToArray("15.00 credits including ACCT*3280, ACCT*3340, ACCT*3350  ")).toEqual([
        "15.00 credits",
        "ACCT*3280",
        "ACCT*3340",
        "ACCT*3350",
    ]);
});
