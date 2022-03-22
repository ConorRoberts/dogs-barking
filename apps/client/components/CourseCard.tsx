import { Course } from "@typedefs/DegreePlan";
import React from "react";

const CourseCard = (props) => {
  const { course } = props;
  const { addCourse } = props;

  const addSemesterClick = () => {
    addCourse(course);
  };

  return (
    <div className="py-1 m-6 flex flex-row bg-neutral-200 place-content-center place-self-center mx-5 my-2 rounded-lg w-4/5">
      <div className="py-1 flex flex-col w-3/4">
        <h4 className="pl-2 pb-0 text-base font-semibold">
          {course.name} ({course.weight})
        </h4>
        <p className="p-2 pt-0 text-xs">{course.description}</p>
        <p className="p-2 pt-0 text-xs">Prerequisites: {course.prereqs}</p>
      </div>
      <div className=" flex flex-col w-1/4 h-full place-self-center place-content-center">
        {/* Add onClick call here, probably generate URL from the courseCode. */}
        <button onClick={addSemesterClick} className="h-20 w-1/2 place-self-center text-white rounded-md bg-green-500 hover:bg-green-400">
          +
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
