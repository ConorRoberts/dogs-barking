type Course = {
  id: string;
  department: string;
  number: number;
  name: string;
  description: string;
  weight: number;
  nodeId?: string;
  school?: string;
  schoolId?: string;
};

export type CourseIndex = {
  [courseCode: string]: Course;
};

export type SemestersOffered = "W" | "S" | "F";
export type YearsOffered = "even" | "odd" | "all";
export default Course;
