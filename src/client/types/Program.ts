import Requirement from "./Requirement";
import School from "./School";

type Program = {
  degree: string;
  name: string;
  id: string;
  short: string;
  requirements?: Requirement[];
  school?: School;
};

export default Program;
