import Course, { CourseIndex } from "types/Course";
import Option from "types/Option";
import generateMajorCourses from ".";

const courses: CourseIndex = {
    "mockCIS3760": {
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
    },
    "mockACCT1220": {
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
    }
};

const cisSection: Option = {
    targetWeight: 0.5,
    courses: ["mockCIS3760"],
    useAnyCourse: false
};

const fakeSection: Option = {
    targetWeight: 0.5,
    courses: [],
    useAnyCourse: false
};


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
expectedCourses.push(mockCIS3760);

test("One course found", () => {
    expect(generateMajorCourses(cisSection, courses)).toEqual(expectedCourses);
});


test("No course found", () => {
    expect(generateMajorCourses(fakeSection, courses)).toEqual([]);
});