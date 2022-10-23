import Instructor from "./Instructor";
import Meeting from "./Meeting";
import Weekday from "./Weekday";

interface Lecture extends Meeting {
  id: string;
  days: Weekday[];
  instructor:Instructor;
  startTime: string;
  endTime: string;
  room: string;
}

export default Lecture;
