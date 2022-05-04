import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./form";
import { LoadingIcon, PlusIcon, TrashIcon } from "./Icons";
import axios from "axios";
import PlannerSemesterCourse from "./PlannerSemesterCourse";
import PlannerSemesterCourseSearch from "./PlannerSemesterCourseSearch";
import PlannerSemesterDeletePrompt from "./PlannerSemesterDeletePrompt";

interface PlannerSemesterProps {
  semesterId: string;
}
const PlannerSemester = ({ semesterId }: PlannerSemesterProps) => {
  const [semesterData, setSemesterData] = useState<PlannerSemesterData | null>(null);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const fetchSemesterData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/id/${semesterId}`);
      setSemesterData(data);
    } catch (error) {
      console.error(error);
    }
  }, [semesterId]);

  // Fetch the semester data on mount
  useEffect(() => {
    fetchSemesterData();
  }, [fetchSemesterData]);

  // If we have no data, we should let the user know it's loading
  if (!semesterData) return <LoadingIcon className="animate-spin mx-auto" />;

  return (
    <div className="flex flex-col gap-4">
      <PlannerSemesterDeletePrompt
        onClose={() => setShowDeletePrompt(false)}
        semester={semesterId}
        open={showDeletePrompt}
        onSubmit={()=>fetchSemesterData()}
      />
      <PlannerSemesterCourseSearch
        open={showCourseSelect}
        onSubmit={() => fetchSemesterData()}
        onClose={() => setShowCourseSelect(false)}
        semester={semesterId}
      />
      <div className="flex justify-between gap-4 items-center">
        <h3 className="capitalize">
          {semesterData.semester} &apos;{semesterData.year % 2000}
        </h3>
        <TrashIcon
          size={20}
          className="text-gray-500 hover:text-gray-600 transition cursor-pointer"
          onClick={() => setShowDeletePrompt(true)}
        />
      </div>
      <div className="flex flex-col gap-px">
        {semesterData.courses.map((e, index) => (
          <PlannerSemesterCourse key={`${semesterId}-${e.id}-${index}`} course={e} semester={semesterId} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
          <PlusIcon size={20} />
          <p>Add Course</p>
        </Button>
      </div>
    </div>
  );
};

export default PlannerSemester;
