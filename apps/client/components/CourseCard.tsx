import { PlannerState } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course } from "@typedefs/DegreePlan";
import React from "react";
import { useSelector } from "react-redux";

interface CourseCardProps {
  course : Course;
  addCourse(courseToAdd : Course) : void;
}

const CourseCard = (props : CourseCardProps) => {
  const { course } = props;
  const { addCourse } = props;
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);

  const isPlannerStateEmpty = () => {
    if (plan.semesters.length == 0) {
      return true;
    }

    return false;
  };

  const isSemesterBeingEdited = () => {
    const newSemesters = [...plan.semesters];
    const semesterToEdit = { ...newSemesters.find((semester) => semester.isEditing == true) };

    if(Object.keys(semesterToEdit).length === 0){
      return false;
    }
    
    return true;
  };

  const addCourseClick = () => {
    addCourse(course);
  };

  return (
    <div className="py-1 m-6 flex flex-row bg-neutral-200 place-content-start place-self-center mx-5 my-2 rounded-lg w-4/5">
      <div className="py-1 flex flex-col w-3/4">
        <p className="pl-2 pb-0 text-base font-semibold">
          {course.id} - {course.name}
        </p>
        <p className="pl-2 italic text-sm">{course.weight != 0 ? course.weight + " Credit(s)" : "No Credit Value"}</p>
        <p className="p-2 pt-1 text-xs">{course.description}</p>
        {/* <p className="p-2 pt-0 text-xs">Prerequisites: {course.prereqs}</p> */}
      </div>
      {isSemesterBeingEdited() ? 
        <div className="flex flex-col w-1/4 h-full place-self-center place-content-center pr-8">
          <button onClick={addCourseClick} className="h-16 w-20 place-self-end text-white rounded-md bg-green-500 hover:bg-green-400">
            +
          </button>
        </div>
        :
        null      
      }
    </div>
  );
};

export default CourseCard;
