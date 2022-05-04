import Course from "./Course";

export interface PlannerSemesterData {
  id: string;
  year: number;
  semester: string;
  courses: Course[];
}
