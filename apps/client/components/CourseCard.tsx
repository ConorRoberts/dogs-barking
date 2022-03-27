import { Course } from "@typedefs/DegreePlan";
import getPrerequisites from "@utils/getPrerequisites";
import React from "react";

interface CourseCardProps {
  course : Course;
  addCourse(courseToAdd : Course) : void;
}

const CourseCard = (props : CourseCardProps) => {
  const { course } = props;
  const { addCourse } = props;

  const addSemesterClick = () => {
    addCourse(course);
  };

  // const getCoursePrereqs = async () => {
  //   console.log("NODE ID: " + course.nodeId);
  //   const coursePrereqs = await getPrerequisites(course.nodeId);
  //   console.info(coursePrereqs);
  //   //course.prereqs = coursePrereqs.toString();
  //   //console.info("PREREQS --> " + course.prereqs);
  // };

  return (
    //getCoursePrereqs(),
    <div className="py-1 m-6 flex flex-row bg-neutral-200 place-content-center place-self-center mx-5 my-2 rounded-lg w-4/5">
      <div className="py-1 flex flex-col w-3/4">
        <p className="pl-2 pb-0 text-base font-semibold">
          {course.id} - {course.name}
        </p>
        <p className="pl-2 italic text-sm">{course.weight != 0 ? course.weight + " Credit(s)" : "No Credit Value"}</p>
        <p className="p-2 pt-1 text-xs">{course.description}</p>
        {/* <p className="p-2 pt-0 text-xs">Prerequisites: {course.prereqs}</p> */}
      </div>
      <div className=" flex flex-col w-1/4 h-full place-self-center place-content-center pr-8">
        {/* Add onClick call here, probably generate URL from the courseCode. */}
        <button onClick={addSemesterClick} className="h-16 w-20 place-self-end text-white rounded-md bg-green-500 hover:bg-green-400">
          +
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
