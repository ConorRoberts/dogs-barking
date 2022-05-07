import courseSchema from "@schema/courseSchema";
import Course from "@typedefs/Course";

describe("Test /api/course", () => {

  // TODO
  it("Returns courses with a given department code/name", () => {
    expect(true).to.be.true;
  });

  // TODO
  it("Returns courses with a given school ID", () => {
    expect(true).to.be.true;
  });

  // TODO
  it("Returns courses within a given semester (winter/summer/fall)", () => {
    expect(true).to.be.true;
  });

  // TODO
  it("Returns courses taught by a given instructor", () => {
    expect(true).to.be.true;
  });

  it("Returns courses with a given weight", () => {
    cy.request("GET", "/api/course?weight=0.5").then(({ status, body }) => {
      const data = JSON.parse(body);
      expect(status).to.equal(200);
      expect(data.every((course: Course) => course.credits === 0.5 && courseSchema.validateSync(course))).to.be.true;
    });
  });
});

export {};
