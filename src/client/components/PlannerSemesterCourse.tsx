import Course from "@typedefs/Course";

const PlannerSemesterCourse = ({ course, semester }: { course: Course; semester: string }) => {
  console.log(course);
  return (
    <div className="bg-white rounded-md shadow-md py-1 px-4 flex justify-between items-center">
      <p>{course.code}</p>
      <p>{course.credits}</p>
    </div>
  );
};

export default PlannerSemesterCourse;
