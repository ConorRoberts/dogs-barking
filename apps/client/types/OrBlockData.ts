interface OrBlockData {
  note?: string;
  type: "course" | "credit";
  target: number;
  id: string;
  requirements?: string[];
  label?: "OrBlock";
}

export default OrBlockData;
