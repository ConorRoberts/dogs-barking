import useSearch from "@hooks/useSearch";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import Course from "@typedefs/Course";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import PlannerSectionSelection from "@typedefs/PlannerSectionSelection";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Modal } from "./form";
import PlannerCourseSearchResult from "./PlannerCourseSearchResult";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  semester: PlannerSemesterData;
}

const PlannerSemesterCourseSearch = ({ open, semester, onSubmit, onClose }: Props) => {
  const [searchText, setSearchText] = useState("");
  const { results } = useSearch(searchText);
  const [selections, setSelections] = useState<PlannerSectionSelection[]>([]);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const credits = selections.reduce((acc, { course }) => acc + course.credits, 0);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `/api/degree-plan/semester/${semester.id}/section`,
        {
          sections: selections.map(({ section }) => section.id),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSelections([]);

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const selectSection = ({ section, course }: PlannerSectionSelection) => {
    const found = selections.some((s) => s.section.id === section.id);
    if (found) {
      // Remove the course from the list
      setSelections(selections.filter((s) => s.section.id === section.id));
    } else {
      // Add the course to the list
      setSelections([...new Set([...selections, { section, course }])]);
    }
  };

  return (
    <Modal onClose={() => onClose()} open={open} width={500}>
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
            {selections.map((e) => (
              <p
                key={`course-to-add-${e.course.code}-${e.section.code}`}
                className="bg-white dark:bg-gray-800 rounded-md py-1 border border-gray-200 px-4 dark:border-gray-600">
                {e.course.code} - {e.section.code}
              </p>
            ))}
          </div>
        </div>
        <Button variant="outline" onClick={handleSubmit}>
          Submit
        </Button>
        <div>
          <h4>Search Results</h4>
          <div className="flex flex-col gap-1">
            {results.slice(0, 10).map((e) => (
              <PlannerCourseSearchResult
                key={e.id}
                course={e as Course}
                selected={selections.some(({ course }) => e.id === course.id)}
                selectSection={selectSection}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PlannerSemesterCourseSearch;
