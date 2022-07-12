import Requirement from "./Requirement";

interface OrBlockData {
  note?: string;
  type: "course" | "credit";
  target: number;
  id: string;
  requirements?: Requirement[];
  label?: "OrBlock";
}

export default OrBlockData;
