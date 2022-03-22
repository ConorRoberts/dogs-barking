import getYearsOffered from "./getYearsOffered";

//Testing for even and odd year offerings

test("ODD YEARS", () => {
    expect(getYearsOffered("Offered in odd-numbered years.")).toEqual("odd");
});
test("EVEN YEARS", () => {
    expect(getYearsOffered("Offered in even-numbered years")).toEqual("even");
});
test("ALL YEARS", () => {
    expect(getYearsOffered("Offered through Distance Education format only")).toEqual("all");
});
