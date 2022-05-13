import Course from "@typedefs/Course";
import { useState } from "react";
import { RadioButtonEmptyIcon, RadioButtonFilledIcon } from "./Icons";
import {motion,AnimatePresence} from "framer-motion";

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
          className="p-1 rounded-md border border-gray-300 dark:bg-gray-800 flex items-center justify-center bg-white dark:border-gray-600"
          onClick={() => selectCourse(course)}>
          {selected ? <RadioButtonFilledIcon size={15} /> : <RadioButtonEmptyIcon size={15} />}
        </div>
        <div
          className="flex flex-col gap-1 bg-white dark:bg-gray-800 flex-1 border border-gray-300 dark:border-gray-600 px-4 rounded-md py-1"
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

export default PlannerCourseSearchResult;