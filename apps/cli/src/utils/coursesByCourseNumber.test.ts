import Course from "types/Course";
import coursesByCourseNumber from ".";

const testCourseNumber = 1220;
const absentCourseNumber = 6000;

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

const mockACCT1220 : Course = {
    courseName: "Introductory Financial Accounting",
    courseNumber: 1220,
    departmentCode: "ACCT",
    semestersOffered: [ "W", "F" ],
    creditWeight: 0.5,
    description: "This is a description for ACCT*1220.",
    locations: "Guelph",
    prerequisites: [],
    corequisites: [],
    lecturesPerWeek: 0,
    labsPerWeek: 3,
    equates: [],
    restrictions: [],
    associatedDepartments: [ "School of Computing" ],
    yearsOffered: "all"
};

const testCourses : Course[] = [];
testCourses.push(mockCIS3760);
testCourses.push(mockACCT1220);

const expectedCourses : Course[] = [];
expectedCourses.push(mockACCT1220);

test("Checks if existing course number returns courses", () => {
    expect(coursesByCourseNumber(testCourses, testCourseNumber)).toEqual(expectedCourses);
});

test("Checks if absent course number returns no courses", () =>{
    expect(coursesByCourseNumber(testCourses, absentCourseNumber)).toEqual([]);
});