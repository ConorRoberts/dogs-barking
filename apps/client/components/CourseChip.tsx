import { Course } from "@typedefs/DegreePlan";
import React from "react";

interface CourseChipProps{
  removeCourse(courseID: string): void;
  viewPlan(): void;
  isEditing: boolean;
  course : Course;
}

/**
 *
 * @param props
 * @returns
 */
const CourseChip = (props : CourseChipProps) => {
  const { removeCourse } = props;
  const { isEditing } = props;
  const { course } = props;
  const { viewPlan } = props;

  /**
 * Function that handles the onClick event for the removal of a course from a semester.
 * @param props
 * @returns
 */
  
  const removeCourseClick = () => {
    removeCourse(course.id);
    viewPlan();
  };

  return (
    <div className=" py-1 flex flex-row bg-white place-self-end mx-5 my-1 rounded-lg w-4/5">
      <div className="py-1 flex flex-col content-end w-full">
        <h4 className="pl-2 pb-0 text-base font-semibold">
          {course.id} - {course.name}
        </h4>
      </div>
      <div className=" flex flex-col f-full w-1/4 place-self-center place-content-center">
        {/* Add onClick call here, probably generate URL from the courseCode. */}
        {isEditing ? (
          <button onClick={removeCourseClick} className="h-1/3 w-1/2 place-self-center text-white rounded-md bg-red-500 hover:bg-red-400">-</button>
        ) : null}
      </div>
    </div>
  );
};

export default CourseChip;
