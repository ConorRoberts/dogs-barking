import AddSemesterModal from "@components/AddSemesterModal";
import CourseCard from "@components/CourseCard";
import { Button, Input, Modal } from "@components/form";
import SemesterCard from "@components/SemesterCard";
import useCourseSearch from "@hooks/useCourseSearch";
import { AuthState } from "@redux/auth";
import { PlannerState, setPlanName, setDepartment, setPlannedSemesters, setWarnings } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course, Warning } from "@typedefs/DegreePlan";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  const addSemesterClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  const [searchText, setSearchText] = useState("");
  const [planName, setNewPlanName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [_showSearchResults, setShowSearchResults] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [viewPlanPopupVisible, setViewPlanPopupVisible] = useState(false);
  
  const { results } = useCourseSearch(searchText);
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const isCourseAlreadyInSemester = (courseID: string, courses: Course[]) => {
    for (const course of courses) {
      if (course.id === courseID) {
        return true;
      }
    }

    return false;
  };

  const writeReduxPlanName = (newPlanName: string) => {
    dispatch(setPlanName(newPlanName));
  };

  const writeReduxDepartment = (department: string) => {
    dispatch(setDepartment(department));
  };

  const planIsValid = () => { 
    if (plan.warnings.length > 0) {
      return false;
    }
    else {
      return true;
    }
  };

  const planModalOKClick = () => { 
    setViewPlanPopupVisible(false);
  };

  const isCourseCurrentlyEnrolled = (enrolledCourses : Course[], courseIDToCheck : string) => {
    console.log(" ---- " + courseIDToCheck);
    for (const course of enrolledCourses) { 
      console.log("++++ " + course.id);
      if (course.id == courseIDToCheck) { 
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

  const writePrereqWarnings = async (currentlyEnrolledCourses: Course[]) => { 
    const newWarnings: Warning[] = [];
    
    for (const enrolledCourse of currentlyEnrolledCourses) { 
      const { data } = await axios.get(`/api/course/prerequisites`, {
        params: {
          id: enrolledCourse.nodeId,
        },
      });
      if (data.length === 0) { // Then no prereqs exist for the course
        dispatch(setWarnings(newWarnings));
        return;
      }
  
      for (const prereq of data) {
        if (prereq.length === 1) { // Then the array holds just a single required course.
  
          if (!isCourseCurrentlyEnrolled(currentlyEnrolledCourses, prereq[0].id)) {
            newWarnings.push({
              type: "PREREQ NOT MET",
              message: "Cannot enroll in '" + enrolledCourse.id + "' before taking '" + prereq[0].id + "'",
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
              message: "Cannot enroll in '" + enrolledCourse.id + "' before taking at least one of " + orBlockToString(prereq) + ".",
              courseID: prereq as string
            });
          }
        }
      }
    }

    //Write the warnings back to redux. If the warning array is empty, than the plan ius considered valid.
    dispatch(setWarnings(newWarnings));
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

  const viewPlan = async () => {
    const enrolledCourses = getCurrentlyPlannedCourses();
    await writePrereqWarnings(enrolledCourses);

    console.log("WARNINGS: ");
    console.log(plan.warnings);

    if (planIsValid()) {
      setViewPlanPopupVisible(false);
    }
    else { 
      setViewPlanPopupVisible(true);
    }
  };

  const addCourse = (courseToAdd: Course) => {
    const newSemesters = [...plan.semesters];
    // Get the current semester being edited
    const semesterToEdit = { ...newSemesters.find((semester) => semester.isEditing === true) };

    if (newSemesters.length === 0) {
      console.info(
        "There are no semesters added to the plan yet. Please add a semester and try adding a course again."
      );
    }
    // Then there are no semesters currently being edited. Print info msg to console.
    else if (Object.keys(semesterToEdit).length === 0) {
      console.info(
        "There are no semesters in edit mode. Try clicking an edit button on a semester, then try adding a course again."
      );
    }
    // Then the course already exists in the semester. Notify via console and do nothing.
    else if (isCourseAlreadyInSemester(courseToAdd.id, semesterToEdit.courses) === true) {
      console.info(
        "Cannot add '" +
          courseToAdd.name +
          "' to semester '" +
          semesterToEdit.name +
          "': '" +
          courseToAdd.name +
          "' already exists."
      );
    }
    // Then the course doesn't exist in the semester yet, so add it.
    else {
      semesterToEdit.courses = [...semesterToEdit.courses, courseToAdd];

      const newSemesterData = newSemesters.map((semester) =>
        semester.id === semesterToEdit.id ? semesterToEdit : semester
      );
      dispatch(setPlannedSemesters(newSemesterData));
    }
  };

  return user != null ? (
    <>
      <h2 className="py-4 text-center font-medium">Degree Planner</h2>
      <h4 className="text-base text-center font-medium">Plan Name</h4>
      <Input
        onChange={(event) => setNewPlanName(event.target.value)}
        className="w-1/4 h-8 p-2 place-self-center m-2"
        type={"text"}
        value={planName}
        onBlur={() => writeReduxPlanName(planName)}
        placeholder="Enter your Plan Name..."
        variant={"blank"}
      />
      <h4 className="text-base text-center font-medium">Plan&apos;s Department</h4>
      <Input
        onChange={(event) => setDepartmentName(event.target.value)}
        className="w-1/4 h-8 p-2 place-self-center m-2"
        type={"text"}
        value={departmentName}
        onBlur={() => writeReduxDepartment(departmentName)}
        placeholder="Enter the department for your plan (e.g. 'CIS' or 'ACCT')"
        variant={"blank"}
      />
      
      <div className="flex flex-col h-full w-full p-6">
        <div className="flex flex-row w-full">
          {/* Semester Builder Section */}
          <div className="flex flex-col w-2/5 pr-4">
            <button
              onClick={addSemesterClick}
              className="w-36 mt-4 h-8 place-self-start text-white rounded-md bg-blue-500 hover:bg-blue-400">
              Add Semester
            </button>
            {isPopupVisible && <AddSemesterModal onClose={addSemesterClick} />}

            <div className="flex flex-col max-h-96 w-full overflow-auto">
              {plan.semesters.map((semester, index) => {
                return (
                  <SemesterCard
                    semesterID={semester.id}
                    semesterName={semester.name}
                    currentEditState={semester.isEditing}
                    timeOfYear={semester.timeOfYear}
                    year={semester.year}
                    index={index}
                    courses={semester.courses}
                    key={`semester-card-${index}`}
                  />
                );
              })}
            </div>
          </div>
          {/* Course Search / Add Course Section */}
          <div className="flex flex-col w-1/2 overflow-auto">
            <h4 className="pb-2 text-base text-center font-medium">Search Available Courses...</h4>
            <Input
              onChange={(event) => setSearchText(event.target.value)}
              className="w-3/5 h-8 p-2 mb-4 place-self-center"
              type={"text"}
              value={searchText}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 100)}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Enter Course Code or Department..."
              variant={"blank"}
            />

            {/* List of CourseCards */}
            <div className="flex px-0 flex-col max-h-96 overflow-auto">
              {results.length > 0 &&
                results.slice(0, 20).map((course) => (
                  <CourseCard addCourse={addCourse} course={course} key={Math.random()} />
                ))}
            </div>

            {/* Other Button Functionality */}
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full p-6 place-content-center">
                {viewPlanPopupVisible ?
                  <Modal size="xl" onClose={() => setViewPlanPopupVisible(false)}>
                    <div className="flex flex-col place-self-center place-content-center overflow-auto">
                      <h5 className="place-self-center">Error Building Plan View</h5>
                      <p className="place-self-center text-red-500 italic">There exist issues with your plan: </p>
                      <ul>
                        {plan.warnings.map((warning) => {
                          return (
                            <li className="py-2 px-8 text-md text-yellow-600" key={Math.random()}>
                              <span className="font-bold">(WARNING: {warning.type})</span><span className="italic"> - {warning.message}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="place-self-center text-red-500 italic">Please fix these issues so that you can view your plan.</p>
                      <Button onClick={planModalOKClick} className="place-self-center rounded-md mt-6 bg-blue-500 hover:bg-blue-400 over">OK</Button>
                    </div>
                  </Modal>
                  :
                  null}

                <Link href={ plan.warnings.length === 0 ? "/view_plan" : "" } passHref>
                  <button onClick={viewPlan} className="w-40 h-10 place-self-center text-white rounded-md bg-blue-500 hover:bg-blue-400">
                    View Plan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="place-self-center">
        <h2 className="py-4 text-center font-medium">Degree Planner</h2>
        <p className="text-2xl pt-10 max-w-screen-md">
          Terribly sorry, but you must be logged in to use the Degree Planner. Please login to your existing account, or
          create a new account and login with it, then try accessing this page again.
        </p>
      </div>
    </>
  );
};

export default Page;
