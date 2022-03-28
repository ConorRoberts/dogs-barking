import getCourseSchool from "@utils/getCourseSchool";

test("Fetch Course UofG", async() => {
  const courseId = "2";
  const school = await getCourseSchool(courseId);
  expect(school).toEqual({"abbrev": "UOFG", "city": "Guelph", "name":"University of Guelph"});
});

test("Fetch Course UofT", async() => {
  const courseId = "5441";
  const school = await getCourseSchool(courseId);
  expect(school).toEqual({"abbrev": "UOFT", "city": "Toronto", "name":"University of Toronto"});
});