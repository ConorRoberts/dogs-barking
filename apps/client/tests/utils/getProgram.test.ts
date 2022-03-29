import getProgram from "@utils/getProgram";
import programSchema from "@schema/programSchema";

test("Get a program based on node id 1x UofG", async () => {
  const nodeId = "7117";
  const program = await getProgram(nodeId);
  expect(programSchema.validate(program)).toBeTruthy();
});

test("Get a program based on node id 1x UofT", async () => {
  const nodeId = "7475";
  const program = await getProgram(nodeId);
  expect(programSchema.validate(program)).toBeTruthy();
});

export {};
