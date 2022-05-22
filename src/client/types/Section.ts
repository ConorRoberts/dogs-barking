import Exam from "./Exam";
import Instructor from "./Instructor";
import Lab from "./Lab";
import Lecture from "./Lecture";

type Section = {
  code: string;
  term?: string;
  year: number;
  semester: string;
  id: string;
  instructor: Instructor;
  labs?: Lab[];
  lectures: Lecture[];
  exams?: Exam[];
};

export default Section;
