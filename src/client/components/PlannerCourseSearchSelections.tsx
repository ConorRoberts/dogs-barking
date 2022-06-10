import PlannerSectionSelection from "@typedefs/PlannerSectionSelection";

interface Props {
  selections: PlannerSectionSelection[];
}

const PlannerCourseSearchSelections = ({ selections }: Props) => {
  const credits = selections.reduce((acc, { course }) => acc + course.credits, 0);

  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex bg-white rounded-full px-2 py-2 shadow-md">
        {[...Array(5)].map((e, index) => (
          <div
            key={`planner course search selection ${index}`}
            className={`w-12 h-3 ${index > 3 ? "bg-gray-300" : "bg-green-500"} rhombus`}
          ></div>
        ))}
      </div> */}
      {selections.map((e) => (
        <p
          key={`course-to-add-${e.course.code}-${e.section.code}`}
          className="bg-white dark:bg-gray-800 rounded-md py-1 border border-gray-200 px-4 dark:border-gray-600"
        >
          {e.course.code} - {e.section.code}
        </p>
      ))}
    </div>
  );
};

export default PlannerCourseSearchSelections;
