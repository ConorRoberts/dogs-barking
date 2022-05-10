import School from "@typedefs/School";
import RatingData from "./RatingData";

type Course = {
  id: string;
  department: string;
  number: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  school?: School;
  requirements: Course[];
  rating: RatingData;
};

export default Course;
