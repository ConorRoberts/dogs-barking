import Instructor from "./Instructor";
import Meeting from "./Meeting";

type Section = {
  code: string;
  term?: string;
  year: number;
  semester: string;
  id: string;
  instructor: Instructor;
  labs: Meeting[];
  lectures: Meeting[];
  exams: Meeting[];
  tutorials: Meeting[];
  seminars: Meeting[];
  seatsRemaining?: number;
};

export default Section;
