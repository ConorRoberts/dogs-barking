import { useAuthenticator } from "@aws-amplify/ui-react";
import useSearch from "@hooks/useSearch";
import Course from "~/types/Course";
import { PlannerSemesterData } from "~/types/DegreePlan";
import PlannerCourseSelection from "~/types/PlannerCourseSelection";
import Section from "~/types/Section";
import getToken from "~/utils/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Input, Modal } from "./form";
import PlannerCourseSearchResult from "./PlannerCourseSearchResult";
import PlannerCourseSearchSelections from "./PlannerCourseSearchSelections";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  semester: PlannerSemesterData;
}

const PlannerSemesterCourseSearch = ({ open, semester, onSubmit, onClose }: Props) => {
  const [searchText, setSearchText] = useState("");
  const { results } = useSearch(searchText);
  const [selections, setSelections] = useState<PlannerCourseSelection[]>([]);
  const { user } = useAuthenticator();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `/api/degree-plan/semester/${semester.id}/section`,
        {
          sections: selections.map(({ section }) => section.id),
        },
        {
          headers: { Authorization: `Bearer ${getToken(user)}` },
        }
      );
      setSelections([]);

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const selectCourse = ({ course, section }: { course: Course; section: Section }) => {
    const foundCourse = selections.some((s) => s.course.id === course.id);
    const foundSection = selections.some((s) => s.section?.id === section?.id);

    if (foundCourse && !foundSection) {
      // Found course but not section. Swap section.
      setSelections(selections.map((s) => (s.course.id === course.id ? { course, section } : s)));
    } else if (foundCourse && foundSection) {
      // Found both courese and section. Remove course.
      setSelections(selections.filter((s) => s.course.id !== course.id));
    } else {
      // Add the course to the list
      setSelections([...new Set([...selections, { section, course }])]);
    }
  };

  useEffect(() => {
    if (!selectedCourse) return;
    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${selectedCourse.id}/section`);

        setSections(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedCourse]);

  return (
    <Modal onClose={() => onClose()} open={open} className="max-w-6xl">
      <div className="flex flex-col gap-2">
        <h4 className="text-center">Search</h4>
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search"
          className={`py-1 text-xl font-light w-full border border-gray-300 dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-md mx-auto max-w-xl`}
          variant="blank"
        />
        <div className="">
          <div>
            {/* <p className="text-center">Search Results</p> */}
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[650px]">
              {results.map((e) => (
                <PlannerCourseSearchResult
                  key={e.id}
                  course={e as Course}
                  selected={selections.find(({ course }) => course?.id === e.id)}
                  selectCourse={selectCourse}
                />
              ))}
            </div>
          </div>

          {/* <div>
            {selectedCourse && (
              <>
                <h2>{selectedCourse.code}</h2>
                <p>{selectedCourse.name}</p>
                <p>{selectedCourse.description}</p>
                <div className="divide-y divide-gray-200">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="py-1 flex gap-2 dark:hover:bg-gray-700 cursor-pointer transition flex-col"
                      onClick={() => selectSection(section)}
                    >
                      <CourseSection section={section} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div> */}

          <div>
            {/* <h4>Selected ({credits})</h4> */}
            <PlannerCourseSearchSelections selections={selections} />
          </div>
        </div>
        <div className="mt-auto flex justify-center">
          <Button variant="outline" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlannerSemesterCourseSearch;
