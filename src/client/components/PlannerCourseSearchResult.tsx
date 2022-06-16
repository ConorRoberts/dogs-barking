import Course from "@typedefs/Course";
import { useEffect, useState } from "react";
import axios from "axios";
import Section from "@typedefs/Section";
import { AnimatePresence, motion } from "framer-motion";
import CourseSection from "./CourseSection";
import { CheckIcon, LoadingIcon } from "./Icons";
import PlannerCourseSelection from "@typedefs/PlannerCourseSelection";

interface Props {
  course: Course;
  selected: PlannerCourseSelection;
  selectCourse: ({ course: Course, section: Section }) => void;
}

const PlannerCourseSearchResult = ({ course, selected, selectCourse }: Props) => {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsFetched, setSectionsFetched] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  useEffect(() => {
    if (!open || sectionsFetched) return;
    setSectionsLoading(true);

    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${course.id}/section`);

        setSections(data);
      } catch (error) {
        console.error(error);
      } finally {
        setSectionsFetched(true);
        setSectionsLoading(false);
      }
    })();
  }, [open, course, sectionsFetched]);

  return (
    <div className="dark:bg-gray-900 bg-white border border-gray-200 dark:border-gray-700 rounded-lg relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition py-1 px-4 rounded-t-lg relative"
      >
        <p className="truncate font-medium text-lg">{course.name}</p>
        <p className="text-sm">{course.code}</p>
        {selected && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2">
            <CheckIcon size={18} className="dark:text-green-400" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, padding: 0, overflow: "hidden" }}
            animate={{ height: "auto", padding: "0.25rem 1rem" }}
            exit={{ height: 0, padding: 0, overflow: "hidden" }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-lg"
          >
            <div className="flex gap-4 p-2 overflow-x-auto sm:justify-center">
              {sections.map((section, index) => (
                <div
                  key={`${section.id} section ${index}`}
                  className="min-w-max"
                  onClick={() => selectCourse({ course, section })}
                >
                  <CourseSection section={section} selected={selected?.section.id === section.id} />
                </div>
              ))}
              {!sectionsLoading && sectionsFetched && sections.length === 0 && (
                <div className="text-center text-sm dark:text-gray-400 text-gray-400 mx-auto">No sections found</div>
              )}
            </div>
            {sectionsLoading && <LoadingIcon size={25} className="mx-auto animate-spin" />}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="py-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition text-center rounded-b-lg text-sm">
        Select course {sections.length ? "without section" : ""}
      </div>
    </div>
  );
};

export default PlannerCourseSearchResult;
