import { PlannerState, setWarnings } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course, Warning } from "@typedefs/DegreePlan";
import useUniquePrereqs from "@hooks/useUniquePrereqs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface CourseCardProps {
  course : Course;
  addCourse(courseToAdd : Course) : void;
}

const CourseCard = (props : CourseCardProps) => {
  const { course } = props;
  const { addCourse } = props;
  const { results } = useUniquePrereqs(course.nodeId);
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const dispatch = useDispatch();

  const isCourseCurrentlyEnrolled = (enrolledCourses : Course[], courseIDToCheck : string) => {
    for (const course of enrolledCourses) { 
      if (course.id === courseIDToCheck) { 
        return true;
      }
    }

    return false;
  };

  const orBlockToString = (orBlock) => {
    console.log("OR BLOCK: ");
    console.log(orBlock);

    let returnStr = "";
    let count = 0;
    for (const courseID of orBlock) {
      if (count === 0) {
        returnStr += "'" + courseID.id + "'";
      }
      else {
        returnStr += " or '" + courseID.id + "'";
      }

      count++;
    }

    return returnStr;
  };

  const writePrereqWarnings = (currentlyEnrolledCourses: Course[], parentCode : string, coursePrereqs) => { 
    const newWarnings : Warning[] = [...plan.warnings];
    if (coursePrereqs.length === 0) { // Then no prereqs exist for the course
      dispatch(setWarnings(newWarnings));
      return;
    }

    for (const prereq of coursePrereqs) {
      if (prereq.length === 1) { // Then the array holds just a single required course.  
        if (!isCourseCurrentlyEnrolled(currentlyEnrolledCourses, prereq)) {
          newWarnings.push({
            type: "PREREQ NOT MET",
            message: "Cannot enroll in '" + parentCode + "' before taking '" + prereq.id + "'",
            courseID: prereq as string
          });
        }
      }
      else {
        let orBlockSatisfied = false;
        for (const courseID of prereq) {
          if (isCourseCurrentlyEnrolled(currentlyEnrolledCourses, courseID)) {
            orBlockSatisfied = true;
            break;
          }
        }

        if (!orBlockSatisfied) {
          newWarnings.push({
            type: "PREREQ NOT MET",
            message: "Cannot enroll in '" + parentCode + "' before taking at least one of " + orBlockToString(prereq) + ".",
            courseID: prereq as string
          });
        }
      }
    }

    //Write the warnings back to redux. If the warning array is empty, than the plan ius considered valid.
    dispatch(setWarnings(newWarnings));
  };

  const isSemesterBeingEdited = () => {
    const newSemesters = [...plan.semesters];
    const semesterToEdit = { ...newSemesters.find((semester) => semester.isEditing == true) };

    if(Object.keys(semesterToEdit).length === 0){
      return false;
    }
    
    return true;
  };

  const getCurrentlyPlannedCourses = () => {
    const currentlyPlannedCourses: Course[] = [];
    const plannedSemesters = [...plan.semesters];
    
    for (const semester of plannedSemesters) {
      for (const course of semester.courses) {
        currentlyPlannedCourses.push(course);
      }
    }

    return currentlyPlannedCourses;
  };

  const planAlreadyContainsCourse = (courseID : string) => {
    // Get prereq string array here...
    const currentPlannedCourses = getCurrentlyPlannedCourses();

    for (const course of currentPlannedCourses) { 
      if (courseID === course.id) { 
        return true;
      }
    }

    return false;
  };

  const addCourseClick = () => {
    if (planAlreadyContainsCourse(course.id)) {
      console.info("Cannot add course '" + course.name + "': It already exists in your plan.");
    }
    else { 
      console.log(results);
      addCourse(course);
      writePrereqWarnings(getCurrentlyPlannedCourses(), course.id, results);
    }
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
