import restrictionsToArray from "./restrictionsToArray";

//testing different restriction variations

test("PRIORITY ACCESS RESTRICTION", () => {
    expect(
        restrictionsToArray(
            "This is a Priority Access Course. Some restrictions may apply during some time periods. Please see the departmental website for more information.  "
        )
    ).toEqual(["Priority Access Course"]);
});

test("COURSE, COURSE", () => {
    expect(restrictionsToArray("MGMT*4020, MGMT*4030 ")).toEqual(["MGMT*4020", "MGMT*4030"]);
});

test("CONSENT REQUIRED", () => {
    expect(
        restrictionsToArray(
            "A minimum cumulative average of 70% in all French Studies course attempts. Instructor consent required."
        )
    ).toEqual(["Instructor consent Required"]);
});
