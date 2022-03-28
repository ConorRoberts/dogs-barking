import getCourse from "@utils/getCourse";
import courseSchema from "@schema/courseSchema";

test("Get a course based on node id 1x UofG", async () => {
  const nodeId = "2";
  const course = await getCourse(nodeId);
  expect(courseSchema.validate(course)).toBeTruthy();
});

test("Get a course based on node id 1x UofT", async () => {
  const nodeId = "6337";
  const course = await getCourse(nodeId);
  expect(courseSchema.validate(course)).toBeTruthy();
});

export {};