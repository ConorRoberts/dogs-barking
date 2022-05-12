import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { useState } from "react";
import { Button } from "./form";
import { LoadingIcon, PlusIcon, TrashIcon } from "./Icons";
import axios from "axios";
import PlannerSemesterCourse from "./PlannerSemesterCourse";
import PlannerSemesterCourseSearch from "./PlannerSemesterCourseSearch";
import PlannerSemesterDeletePrompt from "./PlannerSemesterDeletePrompt";

interface PlannerSemesterProps {
  data: PlannerSemesterData;
}
const PlannerSemester = ({ data }: PlannerSemesterProps) => {
  const { id } = data;

  const [semesterData, setSemesterData] = useState<PlannerSemesterData | null>(data);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const fetchSemesterData = async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/id/${id}`);
      setSemesterData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // If we have no data, we should let the user know it's loading
  if (!semesterData) return <LoadingIcon className="animate-spin mx-auto" />;

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow-center-sm p-2 w-64 h-64 flex-none">
      <PlannerSemesterDeletePrompt
        onClose={() => setShowDeletePrompt(false)}
        semester={id}
        open={showDeletePrompt}
        onSubmit={() => fetchSemesterData()}
      />
      <PlannerSemesterCourseSearch
        open={showCourseSelect}
        onSubmit={() => fetchSemesterData()}
        onClose={() => setShowCourseSelect(false)}
        semester={id}
      />
      <div className="flex justify-between gap-4 items-center">
        <h3 className="capitalize">
          {semesterData.semester} &apos;{semesterData.year % 2000}
        </h3>
        {/* <TrashIcon
          size={20}
          className="text-gray-500 hover:text-gray-600 transition cursor-pointer"
          onClick={() => setShowDeletePrompt(true)}
        /> */}
      </div>
      <div className="flex flex-col gap-px">
        {semesterData.courses.map((e, index) => (
          <PlannerSemesterCourse key={`${id}-${e.id}-${index}`} course={e} semester={id} />
        ))}
      </div>
      <div className="flex justify-center">
        {/* <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
          <PlusIcon size={20} />
          <p>Add Course</p>
        </Button> */}
      </div>
    </div>
  );
};

export default PlannerSemester;
