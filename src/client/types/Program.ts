import School from "./School";

type Program = {
  degree: string;
  name: string;
  id: string;
  short: string;
  requirements?: number;
  school?: School;
};

export default Program;
