import Course from "./Course";

interface DegreePlanData {
  id: string;
  name: string;
  semesters?: PlannerSemesterData[];
}

export interface PlannerSemesterData {
  id: string;
  year: number;
  semester: string;
  courses: Course[];
}

export default DegreePlanData;
