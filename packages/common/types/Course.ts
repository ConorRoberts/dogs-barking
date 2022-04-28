import School from "@typedefs/School";

type Course = {
  id: string;
  department: string;
  number: number;
  code: string;
  name: string;
  description: string;
  weight: number;
  school?: School;
};

export type CourseIndex = {
  [courseCode: string]: Course;
};

export type SemestersOffered = "W" | "S" | "F";
export type YearsOffered = "even" | "odd" | "all";
export default Course;
