describe("Test /api/course/{id}", () => {
  // This test suite shouldn't contain more tests. IDs change whenever we re-run the scraper.

  it("Should have status 400 with an invalid ID", () => {
    cy.request({ method: "GET", url: "/api/course/12345", failOnStatusCode: false }).then((res) => {
      expect(res.status).to.equal(400);
    });
  });
});

export {};
