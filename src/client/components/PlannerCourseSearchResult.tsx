import Course from "@typedefs/Course";
import { useEffect, useState } from "react";
import { RadioButtonEmptyIcon, RadioButtonFilledIcon } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Section from "@typedefs/Section";
import PlannerSectionSelection from "@typedefs/PlannerSectionSelection";

interface Props {
  course: Course;
  selected: boolean;
  selectSection: (course: PlannerSectionSelection) => void;
}

const PlannerCourseSearchResult = ({ course, selected, selectSection }: Props) => {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!open || sections.length > 0) return;

    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${course.id}/section`);

        setSections(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [open, course, sections]);

  return (
    <div>
      <div className={`py-0.5 transition-all duration-75 text-lg flex gap-2`}>
        <div className="p-1 rounded-md border border-gray-300 dark:bg-gray-800 flex items-center justify-center bg-white dark:border-gray-600">
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
            <div className="flex flex-col divide-y dark:divide-gray-300">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="py-1 flex gap-2 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => selectSection({ section, course })}>
                  <p>{section.code}</p>
                  <p>{section.instructor.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlannerCourseSearchResult;
