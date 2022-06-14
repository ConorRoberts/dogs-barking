type Input = {
  Command: string;
  QueryTypes: Query;
  Graph: GraphOptions;
  help: boolean;
  school: string;
};

export type Query = {
  degree: string;
  major: string;
  department: string;
  coursecode: string;
  school: string;
  weight: number;
  coursenum: number;
  level: number;
  prerequisite: string[];
  semester: ("S" | "W" | "F")[];
  title: string[];
  path: boolean;
  options: AuxOptions;
};

export type GraphOptions = {
  graphType: "Regular" | "Program";
  terminal: boolean;
  graphMajor: string[];
  includeExternalCourses: boolean;
  saveAs: string;
  includeGraduateCourses: boolean;
  courseLimit: number;
  hideCoreqs: boolean;
  showRestrictions: boolean;
  displayMajor: boolean;
  displayMinor: boolean;
  displayArea: boolean;
  displayOptions: boolean;
  mergePdf: boolean;
  semester: string;
  school: string;
};

export type AuxOptions = {
  SortMode: SortMode;
  SortDirection: SortDir;
  Scope: CourseScope;
  PrintMode: PrintMode;
};

export type SortMode = "Raw" | "Weight";
export type SortDir = "Ascending" | "Descending";
export type CourseScope = "All" | "Undergrad" | "Grad";
export type PrintMode = "Regular" | "Detailed";

export default Input;
