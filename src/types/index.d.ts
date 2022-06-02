type Program = {
  degree: string;
  name: string;
  id: string;
  short: string;
  requirements?: Requirement[];
  school?: School;
};

type Requirement = OrBlockData | Course | CreditRequirementData | AndBlockData;

type Course = {
  id: string;
  department: string;
  number: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  school?: School;
  requirements: Requirement[];
  rating: RatingData;
  label?: "Course";
  taken?: boolean;
};

interface CreditRequirementData {
  value: number;
  id: string;
  label?: "CreditRequirement";
}

interface OrBlockData {
  note?: string;
  type: "course" | "credit";
  target: number;
  id: string;
  requirements?: Requirement[];
  label?: "OrBlock";
}

interface School {
  country: string;
  address: string;
  province: string;
  phone: string;
  city: string;
  postalCode: string;
  name: string;
  short: string;
  id: string;
  type: string;
  url: string;
  programs?: [
    {
      hasMajor?: boolean;
      hasMinor?: boolean;
      short: string;
      name: string;
      id: string;
    }
  ];
}

interface RatingData {
  difficulty: number;
  timeSpent: number;
  usefulness: number;
  count: number;
}

interface AndBlockData {
  id: string;
  label: "AndBlock";
}
