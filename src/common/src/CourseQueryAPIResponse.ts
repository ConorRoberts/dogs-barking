import Course from "./Course";

interface CourseQueryApiResponse {
  courses: Course[];
  total: number;
}

export default CourseQueryApiResponse;
