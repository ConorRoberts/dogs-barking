import getProgramCourses from "@utils/getProgramCourses";
import { UOFG_COURSE, UOFT_COURSE } from "@config/regex";
import Course from "@dogs-barking/common/types/Course";

test("Get a program's course based on node id 1x UofG", async () => {
    const nodeId = "7117";
    const courses = await getProgramCourses(nodeId);
    expect(courses.major.every((course: Course) => UOFG_COURSE.test(course.id))).toBeTruthy();
});

test("Get a program's course based on node id 1x UofT", async () => {
    const nodeId = "7475";
    const courses = await getProgramCourses(nodeId);
    expect(courses.major.every((course: Course) => UOFT_COURSE.test(course.id))).toBeTruthy();
});

export {};
