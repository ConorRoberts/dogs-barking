import { PlannerSemesterData } from "~/types/DegreePlan";
import { useState } from "react";
import { LayoutIcon } from "~/components/Icons";
import PlannerSemester from "./PlannerSemester";

interface Props {
  year: number;
  semesters: PlannerSemesterData[];
}

/**
 * This component just renders a list of semesters
 * No data modification is handled here
 */
const PlannerYear = ({ year, semesters }: Props) => {
  const [layout, setLayout] = useState<"row" | "col">("row");
  // const [semesters, setSemesters] = useState<PlannerSemesterData[]>(initialSemesters);

  const toggleLayout = () => {
    setLayout(layout === "row" ? "col" : "row");
  };

  return (
    <div>
      <div className="flex gap-4 items-center justify-between">
        <h2>{year}</h2>
        <div className="flex gap-4 items-center">
          <div
            className={`text-gray-500 primary-hover transform ${layout === "col" && "rotate-90"}`}
            onClick={toggleLayout}>
            <LayoutIcon size={20} />
          </div>
        </div>
      </div>
      <div
        className={`gap-4 ${
          layout === "row" ? "flex overflow-x-auto md:justify-center md:grid md:grid-cols-3" : "flex flex-col items-center"
        } transition-all py-4`}>
        {semesters.map((semester) => (
          <PlannerSemester key={semester.id} data={semester}  />
        ))}
      </div>
    </div>
  );
};

export default PlannerYear;
