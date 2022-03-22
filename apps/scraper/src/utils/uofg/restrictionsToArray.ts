/**
 *  Converts the string representation of restrictions to an array representation
    TODO: Credit and average restrictions
*/
const restrictionsToArray = (restrictList?: string) => {
    if (!restrictList) {
        return [];
    }
    const restrictArray = [];

    //course code regex
    const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
    const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);

    const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");
    // bachelor program regexes, non coop
    const baseBachelorRegex = new RegExp(/(B[A-Z]{3})/g);
    const baseBachelorRegex2 = new RegExp(/(B[A-Z]{2})/g);

    const batchelorRegex1 = new RegExp(/(B[A-Z]{3}.[A-Z]{3})/g);
    const batchelorRegex5 = new RegExp(/(B[A-Z]{3}.[A-Z]{2})/g);
    const batchelorRegex2 = new RegExp(/(B[A-Z]{2}.[A-Z]{3})/g);
    const batchelorRegex3 = new RegExp(/(B[A-Z]{3}.[A-Z]{4})/g);
    const batchelorRegex4 = new RegExp(/(B[A-Z]{2}.[A-Z]{4})/g);

    const batchelorRegex6 = new RegExp(/(B[A-Z]{2}\([A-Z][a-z]{2}\))/g);

    const combinedBachelorRegex = new RegExp(
        batchelorRegex3.source +
            "|" +
            batchelorRegex4.source +
            "|" +
            batchelorRegex1.source +
            "|" +
            batchelorRegex2.source +
            "|" +
            batchelorRegex5.source +
            "|" +
            batchelorRegex6.source +
            "|" +
            baseBachelorRegex.source +
            "|" +
            baseBachelorRegex2.source,
        "g"
    );
    // bachelor program regexes, coop
    const baseCoopRegex = new RegExp(/(B[A-Z]{3}:C)/g);
    const baseCoopRegex2 = new RegExp(/(B[A-Z]{2}:C)/g);

    const batchelorCoopRegex1 = new RegExp(/(B[A-Z]{3}.[A-Z]{3}:C)/g);
    const batchelorCoopRegex2 = new RegExp(/(B[A-Z]{2}.[A-Z]{3}:C)/g);
    const batchelorCoopRegex3 = new RegExp(/(B[A-Z]{3}.[A-Z]{4}:C)/g);
    const batchelorCoopRegex4 = new RegExp(/(B[A-Z]{2}.[A-Z]{4}:C)/g);

    const combinedBachelorCoopRegex = new RegExp(
        batchelorCoopRegex3.source +
            "|" +
            batchelorCoopRegex4.source +
            "|" +
            batchelorCoopRegex1.source +
            "|" +
            batchelorCoopRegex2.source +
            "|" +
            baseCoopRegex.source +
            "|" +
            baseCoopRegex2.source,
        "g"
    );

    // search using regexes for required parameters
    const restrictedBachelors = restrictList.match(combinedBachelorRegex);
    const restrictedBachelorsCoop = restrictList.match(combinedBachelorCoopRegex);
    const restrictedCourses = restrictList.match(combinedCourseRegex);

    if (restrictedCourses) {
        for (const course of restrictedCourses) {
            restrictArray.push(course);
        }
    }

    if (restrictList.includes("Restricted to students in")) {
        let tmpStr = "Enrollment in: ";
        if (restrictedBachelors !== null) {
            for (const bachelor of restrictedBachelors) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelors[0])
        }
        if (restrictedBachelorsCoop !== null) {
            for (const bachelor of restrictedBachelorsCoop) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelorsCoop[0])
        }
        restrictArray.push(tmpStr);
    }
    if (restrictList.includes("Not available to co-op")) {
        restrictArray.push("Unavailable for co-op");
    } else if (
        restrictList.includes("Not available to students") ||
        restrictList.includes("May not be taken by students")
    ) {
        let tmpStr = "Not avaiable to students in: ";
        if (restrictedBachelors !== null) {
            for (const bachelor of restrictedBachelors) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelors[0])
        }
        if (restrictedBachelorsCoop !== null) {
            for (const bachelor of restrictedBachelorsCoop) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelorsCoop[0])
        }
        restrictArray.push(tmpStr);
    }

    if (restrictList.includes("Registration in")) {
        let tmpStr = "Enrolled in: ";
        if (restrictedBachelors !== null) {
            for (const bachelor of restrictedBachelors) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelors[0])
        }
        if (restrictedBachelorsCoop !== null) {
            for (const bachelor of restrictedBachelorsCoop) {
                if (bachelor) {
                    if (!tmpStr.includes(bachelor)) {
                        tmpStr = tmpStr.concat(bachelor + ", ");
                    }
                    //restrictArray.push(bachelor)
                }
            }
            //console.log(restrictedBachelorsCoop[0])
        }
        if (restrictList.includes("DVM") || restrictList.includes("D.V.M.")) {
            tmpStr = tmpStr.concat("DVM program");
        }
        restrictArray.push(tmpStr);
    }

    if (restrictList.includes("Priority Access Course")) {
        restrictArray.push("Priority Access Course");
    }

    if (restrictList.includes("Instructor consent required")) {
        restrictArray.push("Instructor consent Required");
    }

    if (restrictList.includes("Permission of the course coordinator")) {
        restrictArray.push("Course Coordinator Permission Required");
    }
    if (restrictList.includes("80% cumulative average")) {
        restrictArray.push("Minimum 80% cumulative average");
    } else if (restrictList.includes("75% cumulative average")) {
        restrictArray.push("Minimum 75% cumulative average");
    } else if (restrictList.includes("70% cumulative average")) {
        restrictArray.push("Minimum 70% cumulative average");
    } else if (restrictList.includes("68% cumulative average")) {
        restrictArray.push("Minimum 68% cumulative average");
    } else if (restrictList.includes("65% cumulative average")) {
        restrictArray.push("Minimum 65% cumulative average");
    } else if (restrictList.includes("60% cumulative average")) {
        restrictArray.push("Minimum 60% cumulative average");
    }

    return restrictArray;
};

export default restrictionsToArray;
