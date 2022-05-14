describe("Course search autocomplete provides valid suggestions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display suggestions", () => {
    cy.get("input[placeholder='Course code']").type("CIS2750");

    cy.wait(100);

    cy.get("div.absolute.top-full > div[href *= '/course/'] p:nth-child(1)").should("contain", "CIS2750");
  });

  it("title should contain correct text", () => {
    cy.get("h1").should("contain", "Dogs Barking Inc.");
  });

  it("Test /course/{id} - CIS2750", () => {
    cy.get("#home-course-search-input").type("CIS2750");
    cy.get("#home-course-search-results > *").first().click();
    cy.get("h2").should("contain", "CIS2750");
  });
});

export {};
