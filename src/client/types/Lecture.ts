import Instructor from "./Instructor";
import Weekday from "./Weekday";

interface Lecture {
  id: string;
  days: Weekday[];
  instructor:Instructor;
  startTime: string;
  endTime: string;
  room: string;
}

export default Lecture;
