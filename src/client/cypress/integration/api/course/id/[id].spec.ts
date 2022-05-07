describe("Test /api/course/{id}", () => {

  // This test suite shouldn't contain more tests. IDs change whenever we re-run the scraper.
  
  it("Should have status 400 with an invalid ID", () => {
    cy.request("GET", "/api/course/12345").then((res) => {
      expect(res.status).to.equal(400);
    });
  });
});

export {};
