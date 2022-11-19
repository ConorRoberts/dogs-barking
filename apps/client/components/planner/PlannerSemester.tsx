import { PlannerSemesterData } from "~/types/DegreePlan";
import { FormEvent, useEffect, useState } from "react";
import { CalendarCheckIcon, CloseIcon, LoadingIcon, PencilIcon, PlusIcon, SaveIcon } from "~/components/Icons";
import axios from "axios";
import PlannerSemesterCourseSearch from "./PlannerSemesterCourseSearch";
import PlannerSemesterDeletePrompt from "./PlannerSemesterDeletePrompt";
import { Button, Input, Select } from "@conorroberts/beluga";
import { motion } from "framer-motion";
import { useAuthenticator } from "@aws-amplify/ui-react";
import getToken from "~/utils/getToken";

interface PlannerSemesterProps {
  data: PlannerSemesterData;
}
const PlannerSemester = ({ data }: PlannerSemesterProps) => {
  const { id } = data;

  const [editState, setEditState] = useState(data);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthenticator();
  // const dispatch = useDispatch();
  // const { plan, currentEditingSemester } = useSelector<RootState, PlannerState>((state) => state.planner);
  // const editing = currentEditingSemester === id;

  const fetchSemesterData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/${id}`, {
        headers: { Authorization: `Bearer ${getToken(user)}` },
      });

      // dispatch(setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? data : e)) }));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const deleteSemester = async () => {
    // Save plan state in case this request fails
    // const tmp = plan;

    try {
      setUpdateLoading(true);
      // Update frontend so this looks really fast
      // dispatch(
      //   setPlan({
      //     ...plan,
      //     semesters: plan.semesters.filter((semester) => semester.id != id),
      //   })
      // );

      await axios.delete(`/api/degree-plan/semester/${id}`, { headers: { Authorization: `Bearer ${getToken(user)}` } });
    } catch (error) {
      console.error(error);

      // Revert plan state
      // dispatch(setPlan(tmp));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSemesterUpdate = async (e?: FormEvent) => {
    e?.preventDefault();
    setUpdateLoading(true);

    try {
      const { semester, year } = editState;

      // dispatch(setCurrentEditingSemester(null));
      // dispatch(
      //   setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? { ...e, semester, year } : e)) })
      // );

      const { data } = await axios.post(
        `/api/degree-plan/semester/${id}`,
        {
          data: {
            semester,
            year,
          },
        },
        { headers: { Authorization: `Bearer ${getToken(user)}` } }
      );

      // dispatch(setPlan({ ...plan, semesters: plan.semesters.map((e) => (e.id === id ? data : e)) }));
    } catch (error) {
      console.error(error);
    }

    setUpdateLoading(false);
  };

  // const toggleEditing = () => {
  //   dispatch(setCurrentEditingSemester(id));
  // };

  const handleDeleteKey = (event: globalThis.KeyboardEvent) => {
    // If key is delete
    if (event.key === "Delete") {
      setShowDeletePrompt(true);
    }
  };

  const removeCourse = async (courseId: string) => {
    try {
      // Remove the course from the semester in our redux store
      // dispatch(
      //   setPlan({
      //     ...plan,
      //     semesters: plan.semesters.map((e) =>
      //       e.id === id ? { ...e, courses: e.courses.filter((c) => c.id !== courseId) } : e
      //     ),
      //   })
      // );
      await axios.delete(`/api/degree-plan/semester/${id}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${getToken(user)}` },
      });
      await fetchSemesterData();
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   // if there is a current editing semester, mount a listener for the delete key
  //   if (currentEditingSemester === id) {
  //     document.addEventListener("keydown", handleDeleteKey);
  //   } else {
  //     document.removeEventListener("keydown", handleDeleteKey);
  //   }

  //   return () => {
  //     document.removeEventListener("keydown", handleDeleteKey);
  //   };
  // }, [currentEditingSemester, id]);

  // If we have no data, we should let the user know it's loading
  if (!data) return <LoadingIcon className="animate-spin mx-auto" />;

  return (
    <motion.div
      className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-center-sm p-2 w-64 min-h-[256px] flex-none m-2"
      initial={{ translateX: "200%" }}
      animate={{ translateX: "0%" }}
      transition={{ duration: 0.4 }}
    >
      {/* {editing && (
        <div
          className="rounded-full p-1 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700 absolute w-6 h-6 -top-3 -right-3 dark:bg-gray-700 transition cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100 bg-white"
          onClick={() => setShowDeletePrompt(true)}
        >
          <CloseIcon size={15} />
        </div>
      )} */}
      {/* <PlannerSemesterDeletePrompt
        onClose={() => setShowDeletePrompt(false)}
        semester={id}
        open={showDeletePrompt}
        onSubmit={() => deleteSemester()}
      /> */}
      {/* <PlannerSemesterCourseSearch
        open={showCourseSelect}
        onSubmit={() => fetchSemesterData()}
        onClose={() => setShowCourseSelect(false)}
        semester={data}
      /> */}
      {/* <RequestRegistrationModal open={showRequestModal} onClose={() => setShowRequestModal(false)} semester={data} />
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
                onChange={(e) => setEditState({ ...editState, semester: e.target.value })}
              >
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
        {(loading || updateLoading) && (
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
      </div> */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
        {data.courses.map((course, index) => (
          <div key={`${id}-${course.id}-${index}`}>
            <div className="py-1 px-2 grid grid-cols-6 items-center">
              <p className="col-span-4">{course.code}</p>
              <p>{course.credits}</p>
              <CloseIcon size={15} className="ml-auto primary-hover" onClick={() => removeCourse(course.id)} />
            </div>
            {course.section && (
              <div className="py-1 px-2">
                <p>#{course.section.code}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-auto">
        <Button variant="outlined" onClick={() => setShowCourseSelect(true)}>
          <PlusIcon size={20} />
          <p>Add Course</p>
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        <CalendarCheckIcon
          size={15}
          className="text-gray-300 dark:text-gray-500 primary-hover"
          onClick={() => setShowRequestModal(true)}
        />
      </div>
    </motion.div>
  );
};

export default PlannerSemester;
