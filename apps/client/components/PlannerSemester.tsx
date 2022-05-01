import Course from "@typedefs/Course";
import useSearch from "@hooks/useSearch";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { useState } from "react";
import { Button, Input, Modal } from "./form";
import { DropdownIcon, PlusIcon } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";

const PlannerSemester = (props: PlannerSemesterData) => {
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { results } = useSearch(searchText);
  const [coursesToAdd, setCoursesToAdd] = useState([]);

  console.log(props);

  const addCourse = (course: Course) => {
    setCoursesToAdd([...coursesToAdd, course]);
  };

  const removeCourse = (course: Course) => {
    setCoursesToAdd(coursesToAdd.filter((c) => c.id !== course.id));
  };

  return (
    <div>
      {showCourseSelect && (
        <Modal onClose={() => setShowCourseSelect(false)}>
          <div className="relative mx-auto max-w-md w-full flex flex-col gap-4">
            <h3 className="text-xl font-normal text-center mb-2">Find your favourite courses</h3>

            <div
              className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-md`}>
              <Input
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                placeholder="Course code"
                className={`py-3 text-xl font-light w-full dark:bg-gray-800`}
                variant="blank"
              />
            </div>
            <div>
              <h4>Selected</h4>
              <div className="flex flex-col gap-2">
                {coursesToAdd.map((e) => (
                  <p key={`course-to-add-${e.code}`} className="bg-white rounded-md py-1 border border-gray-200 px-4">
                    {e.code}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h4>Search Results</h4>
              <div className="flex flex-col gap-1">
                {results.slice(0, 10).map((e) => (
                  <PlannerCourseSearchResult key={e.id} course={e} selected={coursesToAdd.find((c) => e.id === c.id)} />
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <h3 className="capitalize">
        {props.semester} &apos;{props.year % 2000}
      </h3>

      <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
        <PlusIcon size={20} />
        <p>Add Course</p>
      </Button>
    </div>
  );
};

const PlannerCourseSearchResult = ({ course, selected }: { course: Course; selected: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 bg-white rounded-md overflow-hidden border border-gray-200" onClick={() => setOpen(!open)}>
      <div
        className={`dark:bg-gray-800 py-0.5 transition-all duration-75 text-lg flex justify-between gap-8 sm:gap-16`}>
        <div></div>
        <div className="flex flex-col gap-1">
          <p className="truncate">{course.name}</p>
          <p className="text-sm">{course.code}</p>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} className="flex justify-center items-center">
          <DropdownIcon size={25} className="text-gray-500 cursor-pointer hover:text-gray-400" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, padding: 0 }}
            animate={{ height: "auto", padding: "0.5rem 0" }}
            exit={{ height: 0, padding: 0 }}
            transition={{ duration: 0.4 }}
            className="border-t border-gray-200">
            <p>{course.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlannerSemester;
