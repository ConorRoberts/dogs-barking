import Instructor from "./Instructor";
import Weekday from "./Weekday";

interface Meeting {
  id: string;
  days: Weekday[];
  instructor: Instructor;
  startTime: string;
  endTime: string;
  room: string;
  location: string;
}

export default Meeting;
