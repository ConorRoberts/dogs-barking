import getPrograms from "@utils/getPrograms";
import programSchema from "@schema/programSchema";

test("Get All Programs", async () => {
  const programs = await getPrograms();
  expect(programs.every((program) => programSchema.validate(program))).toBeTruthy();

});

export {};
