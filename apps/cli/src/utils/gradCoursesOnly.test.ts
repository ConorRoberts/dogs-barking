import Course from "types/Course";
import gradCoursesOnly from ".";

const mockCIS3760 : Course = {
    courseName: "Software Engineering",
    courseNumber: 3760,
    departmentCode: "CIS",
    semestersOffered: [ "W", "F" ],
    creditWeight: 0.75,
    description: "This is a description for CIS*3760.",
    locations: "Guelph",
    prerequisites: [ "CIS*2750", "CIS*3750" ],
    corequisites: [],
    lecturesPerWeek: 0,
    labsPerWeek: 3,
    equates: [],
    restrictions: [],
    associatedDepartments: [ "School of Computing" ],
    yearsOffered: "all"
};

const mockANSC6010 : Course = {
    courseName: "Topics in Comparative Animal Nutrition",
    courseNumber: 6010,
    departmentCode: "ANSC",
    semestersOffered: [ "F" ],
    creditWeight: 0,
    description: "This is a description for ANSC*6010.",
    locations: "Guelph",
    prerequisites: [],
    corequisites: [],
    lecturesPerWeek: 0,
    labsPerWeek: 3,
    equates: [],
    restrictions: [],
    associatedDepartments: [ "Department of Animal Biosciences" ],
    yearsOffered: "all"
};

const testCoursesWithgrad : Course[] = [mockCIS3760, mockANSC6010];
const testCoursesWithoutgrad : Course[] = [mockCIS3760];

test("Found a grad course", () => {
    expect(gradCoursesOnly(testCoursesWithgrad)).toEqual([mockANSC6010]);
});
test("did not find a grad course", () => {
    expect(gradCoursesOnly(testCoursesWithoutgrad)).toEqual([]);
});