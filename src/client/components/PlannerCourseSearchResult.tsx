import Course from "@typedefs/Course";
import { useEffect, useState } from "react";
import axios from "axios";
import Section from "@typedefs/Section";

interface Props {
  course: Course;
  selected: boolean;
  selectCourse: (course: Course) => void;
}

const PlannerCourseSearchResult = ({ course, selected, selectCourse }: Props) => {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsFetched, setSectionsFetched] = useState(false);

  useEffect(() => {
    if (!open || sectionsFetched) return;

    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${course.id}/section`);

        setSections(data);
      } catch (error) {
        console.error(error);
      } finally {
        setSectionsFetched(true);
      }
    })();
  }, [open, course, sectionsFetched]);

  return (
    <div>
      {/* <div className="p-1 rounded-md border border-gray-300 dark:bg-gray-800 flex items-center justify-center bg-white dark:border-gray-600">
          {selected ? <RadioButtonFilledIcon size={15} /> : <RadioButtonEmptyIcon size={15} />}
        </div> */}
      <div
        onClick={() => selectCourse(course)}
        className="flex flex-col gap-1 bg-white dark:bg-gray-800 flex-1 border border-gray-200 dark:border-gray-600 px-4 rounded-md py-1 hover:bg-gray-100 cursor-pointer transition"
      >
        <p className="truncate">{course.name}</p>
        <p className="text-sm">{course.code}</p>
      </div>
      {/* <AnimatePresence>
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
      </AnimatePresence> */}
    </div>
  );
};

export default PlannerCourseSearchResult;
