import getCourse from "@utils/getCourse";
import getRandomCourse from "@utils/getRandomCourse";
import courseSchema from "@schema/courseSchema";

test("Check if returned course is valid 5x", async () => {
  const ids = [];
  for (let i = 0; i < 5; i++) {
    const nodeId = await getRandomCourse();

    // We don't want to be getting duplicate IDs
    expect(ids.includes(nodeId)).toBeFalsy();

    ids.push(nodeId);

    // Get course from DB
    const course = await getCourse(nodeId.toString());

    // Validate against courseSchema
    expect(courseSchema.validate(course)).toBeTruthy();
  }
});

export {};
