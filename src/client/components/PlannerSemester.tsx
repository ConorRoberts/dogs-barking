import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { FormEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { CloseIcon, LoadingIcon, PencilIcon, PlusIcon, SaveIcon } from "./Icons";
import axios from "axios";
import PlannerSemesterCourse from "./PlannerSemesterCourse";
import PlannerSemesterCourseSearch from "./PlannerSemesterCourseSearch";
import PlannerSemesterDeletePrompt from "./PlannerSemesterDeletePrompt";
import { Button, Input, Select } from "./form";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { AuthState } from "@redux/auth";
import { PlannerState, setCurrentEditingSemester, setPlan } from "@redux/planner";

interface PlannerSemesterProps {
  data: PlannerSemesterData;
  deleteSemester: (semesterId: string) => void;
}
const PlannerSemester = ({ data, deleteSemester }: PlannerSemesterProps) => {
  const { id } = data;

  // const [semesterData, setSemesterData] = useState<PlannerSemesterData>(data);
  const [editState, setEditState] = useState(data);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const dispatch = useDispatch();
  const { plan, currentEditingSemester } = useSelector<RootState, PlannerState>((state) => state.planner);
  const editing = currentEditingSemester === id;

  const fetchSemesterData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      dispatch(setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? data : e)) }));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSemesterUpdate = async (e?: FormEvent) => {
    e?.preventDefault();
    setEditLoading(true);

    try {
      const { semester, year } = editState;

      dispatch(setCurrentEditingSemester(null));
      dispatch(
        setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? { ...e, semester, year } : e)) })
      );

      const { data } = await axios.post(
        `/api/degree-plan/semester/${id}`,
        {
          data: {
            semester,
            year,
          },
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      dispatch(setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? data : e)) }));
    } catch (error) {
      console.error(error);
    }

    setEditLoading(false);
  };

  const toggleEditing = () => {
    dispatch(setCurrentEditingSemester(id));
  };

  const handleDeleteKey = (event: globalThis.KeyboardEvent) => {
    // If key is delete
    if (event.key === "Delete") {
      setShowDeletePrompt(true);
    }
  };

  const removeCourse = async (courseId: string) => {
    try {
      // Remove the course from the semester in our redux store
      dispatch(
        setPlan({
          ...plan,
          semesters: plan.semesters.map((e) =>
            e.id === id ? { ...e, courses: e.courses.filter((c) => c.id !== courseId) } : e
          ),
        })
      );
      await axios.delete(`/api/degree-plan/semester/${id}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await fetchSemesterData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if there is a current editing semester, mount a listener for the delete key
    if (currentEditingSemester === id) {
      document.addEventListener("keydown", handleDeleteKey);
    } else {
      document.removeEventListener("keydown", handleDeleteKey);
    }

    return () => {
      document.removeEventListener("keydown", handleDeleteKey);
    };
  }, [currentEditingSemester, id]);

  // If we have no data, we should let the user know it's loading
  if (!data) return <LoadingIcon className="animate-spin mx-auto" />;

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
            {data.semester} &apos;{data.year % 2000}
          </h3>
        )}
        {editing && (
          <form className="flex-1 grid grid-cols-5 gap-2" onSubmit={handleSemesterUpdate}>
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
          </form>
        )}
        {(loading || editLoading) && (
          <LoadingIcon size={18} className="text-gray-500 hover:text-gray-600 animate-spin" />
        )}
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
            onClick={toggleEditing}
          />
        )}
      </div>
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
        {data.courses.map((course, index) => (
          <div
            className="py-1 px-2 grid grid-cols-6 items-center"
            key={`${id}-${course.id}-${index}`}
            onClick={() => removeCourse(course.id)}>
            <p className="col-span-4">{course.code}</p>
            <p className="">{course.credits}</p>
            <CloseIcon size={15} className="ml-auto" />
          </div>
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
