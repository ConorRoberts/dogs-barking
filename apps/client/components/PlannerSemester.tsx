import Course from "@typedefs/Course";
import useSearch from "@hooks/useSearch";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal } from "./form";
import { LoadingIcon, PlusIcon, RadioButtonEmptyIcon, RadioButtonFilledIcon } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

interface PlannerSemesterProps {
  semesterId: string;
}
const PlannerSemester = (props: PlannerSemesterProps) => {
  const { semesterId } = props;
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { results } = useSearch(searchText);
  const [coursesToAdd, setCoursesToAdd] = useState([]);
  const [semesterData, setSemesterData] = useState<PlannerSemesterData | null>(null);

  const selectCourse = (course: Course) => {
    const found = coursesToAdd.find((c) => c.id === course.id);
    if (found) {
      // Remove the course from the list
      setCoursesToAdd(coursesToAdd.filter((c) => c.id !== course.id));
    } else {
      // Add the course to the list
      setCoursesToAdd([...new Set([...coursesToAdd, course])]);
    }
  };

  const fetchSemesterData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/semester/id/${semesterId}`);
      setSemesterData(data);
    } catch (error) {
      console.error(error);
    }
  }, [semesterId]);

  useEffect(() => {
    fetchSemesterData();
  }, [fetchSemesterData]);

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/degree-plan/semester/id/${""}/courses`, { courses: coursesToAdd.map((e) => e.id) });
      setCoursesToAdd([]);
      setShowCourseSelect(false);
      // await fetchPlanState();
    } catch (error) {
      console.error(error);
    }
  };

  const credits = coursesToAdd.reduce((acc, c) => acc + c.credits, 0);

  if (!semesterData) return <LoadingIcon />;

  return (
    <div>
      {showCourseSelect && (
        <Modal onClose={() => setShowCourseSelect(false)}>
          <div className="relative mx-auto max-w-md w-full flex flex-col gap-4">
            <h3 className="text-xl font-normal text-center mb-2">Find your favourite courses</h3>

            <Input
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Course code"
              className={`py-3 text-xl font-light w-full shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-md`}
              variant="blank"
            />
            <div>
              <h4>Selected ({credits})</h4>
              <div className="flex flex-col gap-2">
                {coursesToAdd.map((e) => (
                  <p key={`course-to-add-${e.code}`} className="bg-white rounded-md py-1 border border-gray-200 px-4">
                    {e.code}
                  </p>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={() => handleSubmit()}>
              Submit
            </Button>
            <div>
              <h4>Search Results</h4>
              <div className="flex flex-col gap-1">
                {results.slice(0, 10).map((e) => (
                  <PlannerCourseSearchResult
                    key={e.id}
                    course={e}
                    selected={coursesToAdd.find((c) => e.id === c.id)}
                    selectCourse={selectCourse}
                  />
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <h3 className="capitalize">
        {semesterData.semester} &apos;{semesterData.year % 2000}
      </h3>

      <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
        <PlusIcon size={20} />
        <p>Add Course</p>
      </Button>
    </div>
  );
};

const PlannerCourseSearchResult = ({
  course,
  selected,
  selectCourse,
}: {
  course: Course;
  selected: boolean;
  selectCourse: (course: Course) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className={`py-0.5 transition-all duration-75 text-lg flex gap-2 sm:gap-16`}>
        <div
          className="p-1 rounded-md border border-gray-300 flex items-center justify-center bg-white"
          onClick={() => selectCourse(course)}>
          {selected ? <RadioButtonFilledIcon size={15} /> : <RadioButtonEmptyIcon size={15} />}
        </div>
        <div
          className="flex flex-col gap-1 bg-white flex-1 border border-gray-300 px-4 rounded-md py-1"
          onClick={() => setOpen(!open)}>
          <p className="truncate">{course.name}</p>
          <p className="text-sm">{course.code}</p>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, padding: 0, overflow: "hidden" }}
            animate={{ height: "auto", padding: "0.5rem 0" }}
            exit={{ height: 0, padding: 0, overflow: "hidden" }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden">
            <p>{course.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlannerSemester;
