import PlannerSemester from "./PlannerSemester";

interface Props {
  year: number;

  // Semester IDS
  semesters: string[];
}

const PlannerYear = ({ year,semesters }: Props) => {
  return (
    <div>
      <h2>{year}</h2>
      <div className="overflow-x-auto flex gap-4">
        {semesters.map((id) => (
          <PlannerSemester key={id} semesterId={id} />
        ))}
      </div>
    </div>
  );
};

export default PlannerYear;
