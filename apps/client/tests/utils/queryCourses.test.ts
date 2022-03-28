import CourseQuery from "@dogs-barking/common/types/CourseQuery";
import courseSchema from "@schema/courseSchema";
import queryCourses from "@utils/queryCourses";

test(("Search for course based on degree"), async() => {
  const testQuery:CourseQuery = {
    degree: "B.Eng.",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.degree).toEqual("B.Eng."));
});

test(("Search for course based on School UofG"), async() => {
  const testQuery:CourseQuery = {
    school: "UofG",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.school).toEqual("UofG"));
});

test(("Search for course based on School UofT"), async() => {
  const testQuery:CourseQuery = {
    school: "UofT",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.school).toEqual("UofT"));
});

test(("Search for course based on scope undergrad"), async() => {
  const testQuery:CourseQuery = {
    scope: "undergrad",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.number).toBeLessThan(5000));
});

test(("Search for course based on scope grad"), async() => {
  const testQuery:CourseQuery = {
    scope: "grad",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.number).toBeGreaterThan(5000));
});

test(("Search for course based on CourseID: CIS1300"), async() => {
  const testQuery:CourseQuery = {
    courseId: "CIS1300",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.id).toEqual("CIS1300"));
});

test(("Search for course based on Department CIS"), async() => {
  const testQuery:CourseQuery = {
    department: "CIS",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.department).toEqual("CIS"));
});

test(("Search for course based on Weight 0.5"), async() => {
  const testQuery:CourseQuery = {
    weight: 0.5,
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.weight).toEqual(0.5));
});

test(("Search for course based on Weight 0.25"), async() => {
  const testQuery:CourseQuery = {
    weight: 0.25,
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.weight).toEqual(0.25));
});

test(("Search for course based on Weight 0.75"), async() => {
  const testQuery:CourseQuery = {
    weight: 0.75,
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.weight).toEqual(0.75));
});

test(("Search for course based on Name"), async() => {
  const testQuery:CourseQuery = {
    name: "Programming",
    description: "",
    prerequisites: [],
    sortKey: "",
    sortDir: "asc",
    pageNum: 0,
    pageSize: 10
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.name).toContain("Programming"));
});

test(("Search for course based on Name"), async() => {
  const testQuery:CourseQuery = {
    name: "Programming",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.name).toContain("Programming"));
});

test(("Search for course based on description"), async() => {
  const testQuery:CourseQuery = {
    description: "Calculus",
  };
  const courses = await queryCourses(testQuery);
  courses.map((course) => expect(courseSchema.validate(course)).toBeTruthy());
  courses.map((course) => expect(course.name).toContain("Calculus"));
});