import Course from "types/Course";

const containsPrereq = (course: Course, queryPrereqs: string[]): boolean => {
    const coursePrereqs = course.prerequisites;
    if (coursePrereqs.length === 0 && queryPrereqs.length > 0) {
        return false;
    } else if (coursePrereqs.length === 0 && queryPrereqs.length === 0) {
        return true;
    } else if (coursePrereqs.length > 0 && queryPrereqs.length > 0) {
        let includesCount = 0;
        for (const qPrereq of queryPrereqs) {
            const prqs = coursePrereqs.join(" ");
            prqs.includes(qPrereq) ? includesCount++ : null;
        }
        return includesCount === queryPrereqs.length;
    }

    return false;
};
export default containsPrereq;
