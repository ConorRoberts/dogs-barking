import Requirement from "./Requirement";

interface OrBlockData {
  type: "course" | "credit";
  target: number;
  id: string;
  requirements?: Requirement[];
  label?: "OrBlock";
}

export default OrBlockData;
