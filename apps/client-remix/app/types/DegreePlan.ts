import Course from "./Course";
import Section from "./Section";

interface DegreePlanData {
  id: string;
  name: string;
  semesters?: PlannerSemesterData[];
}

export interface PlannerSemesterData {
  id: string;
  year: number;
  semester: string;
  courses: (Course & { section?: Section })[];
}

export default DegreePlanData;
