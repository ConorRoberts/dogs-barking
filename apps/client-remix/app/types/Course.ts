import School from "~/types/School";
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
  requirements: string[];
  rating: RatingData;
  label?: "Course";
  taken?: boolean;
};

export default Course;
