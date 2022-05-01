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
  requirements: Course[];
};

export default Course;
