describe("Catalog", () => {
  beforeEach(() => {
    cy.visit("catalog");
  });
  it("Items per page set to default of 50", () => {
    cy.get(":nth-child(3) > .relative > .w-full > option[selected]").should("have.value", "50");
  });
  it("Sort direction default to 'desc'", () => {
    cy.get(":nth-child(2) > .relative > .w-full > option[selected]").should("have.value", "desc");
  });
  it("Courses button should be selected by default", () => {
    cy.contains("Courses").should("have.attr", "variant", "default");
    cy.contains("Programs").should("have.attr", "variant", "outline");
  });
  it("Sorting by course code (asc) should give ACCT1220 first", () => {
    cy.get(".grid-cols-3.gap-4 > :nth-child(1) > .relative > .w-full").select("id");
    cy.get(":nth-child(2) > .relative > .w-full").select("asc");
    cy.get(":nth-child(1) > li > div > .font-medium").should("have.text", "ACCT1220");
  });
  it("Clicking a course takes you to its course page", () => {
    cy.get(":nth-child(1) > li > div > .font-medium").click();
    cy.url().should("include", "/course/2984");
  });
});

export {};
