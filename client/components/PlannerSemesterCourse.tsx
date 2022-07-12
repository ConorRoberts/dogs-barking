import Course from "@typedefs/Course";
import Section from "@typedefs/Section";

const PlannerSemesterCourse = ({ course }: { course: Course & { section?: Section }; semester: string }) => {
  return (
    <div className="py-1 px-4 ">
      <div className="flex justify-between items-center">
        <p>{course.code}</p>
        <p>{course.credits}</p>
      </div>
      {course.section && <p>{course.section.code}</p>}
    </div>
  );
};

export default PlannerSemesterCourse;
