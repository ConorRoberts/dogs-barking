import { Graph, Options } from "graphviz";
import Course, { CourseIndex } from "types/Course";
import { GraphOptions } from "types/Input";

const addRegNode = (courseCode : string, prereqStr : string, courseListToGraph : Course[], courseList : CourseIndex, opts : GraphOptions, courseGraph : Graph, attributes : Options) => {
    //opts.school === "uoft"? courseCode = courseCode.substring(0, courseCode.length - 2) : null;
    const courseCodeRegex = new RegExp(/[A-Z]{2,5}\*[0-9]{4}/g);
    const uoftRegex = new RegExp(/[A-Z]{3}[1-9]{3}/, "g");
    // Find the VALID course codes within the current prerequisite
    const prereqCourseCodesUofT = prereqStr.match(uoftRegex);
    const prerequisiteCourseCodes = prereqStr.match(courseCodeRegex);
    if (opts.school === "uoft") { // same as uofg just different method of data processing
        // For each valid course code, perform further operations
        prereqCourseCodesUofT?.forEach((prerequisiteCourseCode) => {
            // Check that the prereq course code exists in the filtered data set
            //console.log(prerequisiteCourseCode);
            const courseCodeFound = courseListToGraph.find(
                ({ courseNumber, departmentCode }) =>
                    (departmentCode + courseNumber === prerequisiteCourseCode)
            );

            // Check that the prereq course code exists in the master data set
            const courseExists = courseList[prerequisiteCourseCode] ? true : false;

            // Include external courses if the course exists but isn't in our filtered data set
            if (opts.includeExternalCourses && !courseCodeFound && courseExists) {
                courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
                courseListToGraph.push(courseList[prerequisiteCourseCode]);
            }

            // Course exists and no additional operations must be performed
            if (courseCodeFound)
                courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
        });
    } else if (opts.school === "uofg") {
        // For each valid course code, perform further operations
        prerequisiteCourseCodes?.forEach((prerequisiteCourseCode) => {
            // Check that the prereq course code exists in the filtered data set
            const courseCodeFound = courseListToGraph.find(
                ({ courseNumber, departmentCode }) =>
                    departmentCode + "*" + courseNumber === prerequisiteCourseCode
            );

            // Check that the prereq course code exists in the master data set
            const courseExists = courseList[prerequisiteCourseCode] ? true : false;

            // Include external courses if the course exists but isn't in our filtered data set
            if (opts.includeExternalCourses && !courseCodeFound && courseExists) {
                courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
                courseListToGraph.push(courseList[prerequisiteCourseCode]);
            }

            // Course exists and no additional operations must be performed
            if (courseCodeFound)
                courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
        });
    }

    // For each valid course code, perform further operations
    prerequisiteCourseCodes?.forEach((prerequisiteCourseCode) => {
        // Check that the prereq course code exists in the filtered data set
        const courseCodeFound = courseListToGraph.find(
            ({ courseNumber, departmentCode }) =>
                departmentCode + "*" + courseNumber === prerequisiteCourseCode
        );

        // Check that the prereq course code exists in the master data set
        const courseExists = courseList[prerequisiteCourseCode] ? true : false;

        // Include external courses if the course exists but isn't in our filtered data set
        if (opts.includeExternalCourses && !courseCodeFound && courseExists) {
            courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
            courseListToGraph.push(courseList[prerequisiteCourseCode]);
        }

        // Course exists and no additional operations must be performed
        if (courseCodeFound)
            courseGraph.addEdge(prerequisiteCourseCode, courseCode, attributes);
    });
};

export default addRegNode;