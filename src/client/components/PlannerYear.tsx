import { PlannerSemesterData } from "@typedefs/DegreePlan";
import PlannerSemester from "./PlannerSemester";

interface Props {
  year: number;

  // Semester IDS
  semesters: PlannerSemesterData[];
}

const PlannerYear = ({ year, semesters }: Props) => {
  return (
    <div className="">
      <h2>{year}</h2>
      <div className="overflow-x-scroll flex gap-4">
        {semesters.map((semester) => (
          <PlannerSemester key={semester.id} data={semester} />
        ))}
      </div>
    </div>
  );
};

export default PlannerYear;
