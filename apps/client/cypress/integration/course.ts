describe("Course", () => {
  beforeEach(() => {
    cy.visit("/course/2984");
  });
  it("Items per page set to default of 50", () => {
    cy.get(":nth-child(3) > .relative > .w-full > option[selected]").should("have.value", "50");
  });
});

export {};
