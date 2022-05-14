import Course from "@typedefs/Course";

const PlannerSemesterCourse = ({ course }: { course: Course; semester: string }) => {
  return (
    <div className="py-1 px-4 flex justify-between items-center">
      <p>{course.code}</p>
      <p>{course.credits}</p>
    </div>
  );
};

export default PlannerSemesterCourse;
