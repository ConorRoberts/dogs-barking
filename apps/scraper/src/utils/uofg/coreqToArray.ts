/**
 * Converts the string representation of corequisites to an array representation
 * .
 * @param courses: a course code.
 * @returns: An Array of corequisites.
 */
const coreqToArray = (coReqList?: string): string[] => {
    if (!coReqList) {
        return [];
    }
    //console.log("coReq " + coReqList)
    if (coReqList.includes("can be taken as co-requisite")) {
        coReqList = coReqList.replace("can be taken as co-requisite", "*OPTIONAL*");
    }
    if (coReqList.includes(" of ")) {
        const tmplist = coReqList.split("of");
        tmplist[1] = tmplist[1].replace(/, /g, " / ").replace(")", "");
        tmplist[0] = tmplist[0].replace("(", "");
        tmplist[0] += "of";
        coReqList = tmplist.join("");
    }

    const coReqs = coReqList.split(",");
    for (let i = 0; i < coReqs.length; i++) {
        coReqs[i] = coReqs[i].replace("(", "").replace(")", "");
        coReqs[i] = coReqs[i].replace(/ or /g, " / ");
        coReqs[i] = coReqs[i].replace(/ OR /g, " / ");
    }
    //console.log("new coReq " + coReqs)
    return coReqs.map((e) => e.trim());
};

export default coreqToArray;
