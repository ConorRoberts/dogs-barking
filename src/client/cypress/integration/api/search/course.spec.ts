import Course from "@typedefs/Course";

describe("Test /api/search/course", () => {
  it("Should return courses by course code", () => {
    const queryText = "CIS";
    cy.request("GET", `/api/search/course?query=${queryText}`).then(({ status, body: data }) => {
      expect(status).to.equal(200);
      expect(data.every((course: Course) => course.code.startsWith(queryText))).to.be.true;
    });
  });

  it("Should return courses by course name", () => {
    const queryText = "computer";
    cy.request("GET", `/api/search/course?query=${queryText}`).then(({ status, body: data }) => {
      expect(status).to.equal(200);
      expect(
        data.every(
          (course: Course) =>
            course.name.toLowerCase().includes(queryText) || course.description.toLowerCase().includes(queryText)
        )
      ).to.be.true;
    });
  });
});

export {};
