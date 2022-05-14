import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { FormEvent, useState } from "react";
import { CloseIcon, LoadingIcon, PencilIcon, PlusIcon, SaveIcon } from "./Icons";
import axios from "axios";
import PlannerSemesterCourse from "./PlannerSemesterCourse";
import PlannerSemesterCourseSearch from "./PlannerSemesterCourseSearch";
import PlannerSemesterDeletePrompt from "./PlannerSemesterDeletePrompt";
import { Button, Input, Select } from "./form";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { AuthState } from "@redux/auth";

interface PlannerSemesterProps {
  data: PlannerSemesterData;
  deleteSemester: (semesterId: string) => void;
}
const PlannerSemester = ({ data, deleteSemester }: PlannerSemesterProps) => {
  const { id } = data;

  const [semesterData, setSemesterData] = useState<PlannerSemesterData>(data);
  const [editState, setEditState] = useState(data);
  const [editing, setEditing] = useState(false);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user,token } = useSelector<RootState, AuthState>((state) => state.auth);

  const fetchSemesterData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesterData(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSemesterUpdate = async () => {
    setEditLoading(true);

    try {
      const { semester, year } = editState;
      const { data } = await axios.post(
        `/api/degree-plan/semester/${id}`,
        {
          data: {
            semester,
            year,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(false);
      setSemesterData(data);
    } catch (error) {
      console.error(error);
    }

    setEditLoading(false);
  };

  // If we have no data, we should let the user know it's loading
  if (!semesterData) return <LoadingIcon className="animate-spin mx-auto" />;

  return (
    <motion.div
      className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-center-sm p-2 w-64 min-h-[256px] flex-none m-2"
      initial={{ translateX: "200%" }}
      animate={{ translateX: "0%" }}
      transition={{ duration: 0.4 }}>
      <PlannerSemesterDeletePrompt
        onClose={() => setShowDeletePrompt(false)}
        semester={id}
        open={showDeletePrompt}
        onSubmit={() => deleteSemester(id)}
      />
      <PlannerSemesterCourseSearch
        open={showCourseSelect}
        onSubmit={() => fetchSemesterData()}
        onClose={() => setShowCourseSelect(false)}
        semester={id}
      />
      <div className="flex justify-between gap-4 items-center">
        {!editing && (
          <h3 className="capitalize">
            {semesterData.semester} &apos;{semesterData.year % 2000}
          </h3>
        )}
        {editing && (
          <div className="flex-1 grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <Select
                value={editState.semester}
                onChange={(e) => setEditState({ ...editState, semester: e.target.value })}>
                <option value="winter">Winter</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
              </Select>
            </div>
            <div className="col-span-2">
              <Input
                value={editState.year}
                onChange={(e) => setEditState({ ...editState, year: parseInt(e.target.value) })}
                type="number"
              />
            </div>
          </div>
        )}
        {loading && <LoadingIcon size={18} className="text-gray-500 hover:text-gray-600 animate-spin" />}
        {editing ? (
          <SaveIcon
            size={18}
            className="text-gray-500 hover:text-gray-600 transition cursor-pointer"
            onClick={handleSemesterUpdate}
          />
        ) : (
          <PencilIcon
            size={18}
            className="text-gray-500 hover:text-gray-600 transition cursor-pointer"
            onClick={() => setEditing(true)}
          />
        )}
      </div>
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
        {semesterData.courses.map((e, index) => (
          <PlannerSemesterCourse key={`${id}-${e.id}-${index}`} course={e} semester={id} />
        ))}
      </div>
      <div className="flex justify-center mt-auto">
        <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
          <PlusIcon size={20} />
          <p>Add Course</p>
        </Button>
      </div>
    </motion.div>
  );
};

export default PlannerSemester;
