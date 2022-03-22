import { CourseIndex, SemestersOffered } from "types/Course";
import fetch from "node-fetch";
import getSemestersOffered from "../getSemestersOffered";

const scrapeCourses = async ():Promise<CourseIndex> => {
    const courses: CourseIndex = {};
    const apiKey = "49F977E5EB044A208E673FC0C0C99E4D";
    const baseURL = "https://openapi.data.uwaterloo.ca/v3/";
    
    const headers = {
        "x-api-key": apiKey
    };
    // making call to get term code for searching courses
    const termResponse = await fetch(baseURL + "terms", { method: "GET", headers: headers});
    const termData = await termResponse.json();

    let termCodes = new Map<string, string>();
    const searchTerms = new Set(["Fall 2021", "Winter 2022", "Spring 2022"]);

    for (let d of termData) {
        if (searchTerms.has(d["name"])) {
            termCodes.set(d["termCode"], d["name"]);
        }
    }

    for (let [t, semester] of termCodes) {
        const sem = getSemestersOffered(semester.charAt(0));
        const courseResponse = await fetch(baseURL + "Courses/" + t, { method: "GET", headers: headers});
        const courseData = await courseResponse.json();

        for (let course of courseData) {
            const semester = termCodes.get(t);
            const courseCode = course["subjectCode"] + course["catalogNumber"];
            const courseName = course["title"];
            const courseNumber = course["catalogNumber"];
            const departmentCode = course["subjectCode"];
            const semestersOffered: SemestersOffered[] = sem;
            const creditWeight = 0.5;
            const description = course["description"];
            const location = "Waterloo";
            const prerequisites: string[] = [];
            const corequisites: string[] = [];
            const lecturesPerWeek = 1;
            const labsPerWeek = 1;
            const equates: string[] = [];
            const restrictions: string[] = [];
            const associatedDepartments = [course["associatedAcademicOrgCode"]];
            const yearsOffered = "all";
            const school = "UW";
            
            courses[courseCode] = {
                courseNumber: courseNumber,
                creditWeight,
                departmentCode,
                semestersOffered,
                description,
                courseName,
                prerequisites,
                corequisites,
                restrictions,
                yearsOffered,
                labsPerWeek,
                associatedDepartments,
                equates,
                location,
                school: "UofT"
            };
        }
    }

    return courses;
};
export default scrapeCourses;