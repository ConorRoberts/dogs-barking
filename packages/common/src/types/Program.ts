import School from "./School";

type Program = {
  degree: string;
  name: string;
  id: string;
  short: string;
  major?: string[];
  minor?: string[];
  school?: School;
};

export default Program;
