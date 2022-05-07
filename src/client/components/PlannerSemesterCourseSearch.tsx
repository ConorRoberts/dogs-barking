import useSearch from "@hooks/useSearch";
import Course from "@typedefs/Course";
import axios from "axios";
import { useState } from "react";
import { Button, Input, Modal } from "./form";
import PlannerCourseSearchResult from "./PlannerCourseSearchResult";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  semester: string;
}

const PlannerSemesterCourseSearch = ({ open, semester, onSubmit, onClose }: Props) => {
  const [searchText, setSearchText] = useState("");
  const { results } = useSearch(searchText);
  const [coursesToAdd, setCoursesToAdd] = useState([]);

  const credits = coursesToAdd.reduce((acc, c) => acc + c.credits, 0);

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/degree-plan/semester/id/${semester}/courses`, {
        courses: coursesToAdd.map((e) => e.id),
      });
      setCoursesToAdd([]);

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

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
  if (!open) return null;
  return (
    <Modal onClose={() => onClose()}>
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
        <Button variant="outline" onClick={handleSubmit}>
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
  );
};

export default PlannerSemesterCourseSearch;
