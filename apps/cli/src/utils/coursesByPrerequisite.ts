import Course from "types/Course";
import containsPrereq from "../containsPrereq";

/**
 * Query courses by their prerequisite.
 * @param courses: An array of JSON course objects.
 * @param prereqs: A string array of prerequisites.
 * @returns: An array of courses.
 */
const coursesByPrerequisite = (courses: Course[], prereqs: string[]): Course[] => {
    const filteredJSON = courses.filter((course) => containsPrereq(course, prereqs));
    return filteredJSON;
};

export default coursesByPrerequisite;
