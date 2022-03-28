import getProgramSchool from "@utils/getProgramSchool";
import schoolSchema from "@schema/schoolSchema";

test("Get a program's school based on node id 1x UofG", async () => {
    const nodeId = "7117";
    const school = await getProgramSchool(nodeId);
    expect(schoolSchema.validate(school)).toBeTruthy();
});

test("Get a program's school based on node id 1x UofT", async () => {
    const nodeId = "7475";
    const school = await getProgramSchool(nodeId);
    expect(schoolSchema.validate(school)).toBeTruthy();
});

export {};
