/**
 * Takes in a string, and parses any related course codes out of it
 */
const parseCourses = (input?:string):string[] => {
    if (!input) return [];

    const courses:string[] = [];
    if (input.includes("One of")) {
        const tmplist = input.split("of");
        tmplist[1] = tmplist[1].replace(/, /g, " / ").replace(")", "");
        tmplist[0] = tmplist[0].replace("(", "");
        tmplist[0] += "of";
        input = tmplist.join("");
    }

    const preReqs = input.split(",");
    for (let i = 0; i < preReqs.length; i++) {
        preReqs[i] = preReqs[i].replace("(", "").replace(")", "");
        preReqs[i] = preReqs[i].replace(/ or /g, " / ");
    }

    return courses.map((e) => e.trim());
};
export default parseCourses;