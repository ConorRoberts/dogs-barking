import Course from "./Course";
import Program from "./Program";
import School from "./School";

interface User {
  id: string;
  birthdate: string;
  name: string;
  email: string;
  school: School | null;
  major: Program | null;
  minor: Program | null;
  takenCourses: Course[];
  token: string | null;
}

export default User;
