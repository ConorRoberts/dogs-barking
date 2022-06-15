describe("Course search autocomplete provides valid suggestions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display suggestions", () => {
    cy.get("#home-search-button").click();
    cy.get("input[placeholder='Course code']").type("CIS2750");

    cy.get("#search-modal-result-CIS2750").should("contain", "CIS2750");
  });

  it("title should contain correct text", () => {
    cy.get("h1").should("contain", "Dogs Barking");
  });

  it("Test /course/{id} - CIS2750", () => {
    cy.get("#home-search-button").click();
    cy.get("input[placeholder='Course code']").type("CIS2750");

    cy.get("#search-modal-result-CIS2750").click();
  });
});

export {};
