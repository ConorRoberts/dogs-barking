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
});

export {};
