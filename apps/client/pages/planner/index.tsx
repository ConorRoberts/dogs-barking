import AddSemesterModal from "@components/AddSemesterModal";
import CourseCard from "@components/CourseCard";
import { Input } from "@components/form";
import SemesterCard from "@components/SemesterCard";
import { exampleCourses } from "@data/plannerDummyData";
import useCourseSearch from "@hooks/useCourseSearch";
import { AuthState } from "@redux/auth";
import { PlannerState, setPlannedSemesters } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course } from "@typedefs/DegreePlan";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  const addSemesterClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  const [searchText, setSearchText] = useState("");
  const { results } = useCourseSearch({ courseId: searchText });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  
  const isCourseAlreadyInSemester = (courseID : string, courses : Course[]) => {
    for(const course of courses){
      if(course.id === courseID){
        return true;
      }
    }
    
    return false;
  };

  const getCourseTitle = (fullName : string) => {
    const titleSplit = fullName.split(" - ");

    return titleSplit[1];
  };

  const addCourse = (courseToAdd : Course) => {
    const newSemesters = [...plan.semesters];
    // Get the current semester being edited
    const semesterToEdit = {...newSemesters.find((semester) => semester.isEditing === true)};

    // Then there are no semesters currently being edited. Print info msg to console.
    if(Object.keys(semesterToEdit).length === 0){
      console.info("There are no semesters in edit mode. Try clicking an edit button on a semester, then try adding a course again.");
    }
    // Then the course already exists in the semester. Notify via console and do nothing.
    else if(isCourseAlreadyInSemester(courseToAdd.id, semesterToEdit.courses) === true){
      const courseTitle = getCourseTitle(courseToAdd.name);
      console.info("Cannot add '" + courseTitle + "' to semester '" + semesterToEdit.name + "': '" + courseTitle + "' already exists.");
    }
    // Then the course doesn't exist in the semester yet, so add it.
    else{
      semesterToEdit.courses = [...semesterToEdit.courses, courseToAdd];

      const newSemesterData = newSemesters.map((semester) => semester.id === semesterToEdit.id ? semesterToEdit : semester );
      dispatch(setPlannedSemesters(newSemesterData));
    }
  };


  return user != null ? (
    <>
      <h2 className="py-4 text-center font-medium">Degree Planner</h2>
      <div className="flex flex-col h-full w-full p-6">
        <div className="flex flex-row w-full">
          {/* Semester Builder Section */}
          <div className="flex flex-col w-2/5 pr-4">
            <h4 className="text-base text-center font-medium">Degree Name</h4>
            <button
              onClick={addSemesterClick}
              className="w-36 h-8 place-self-start text-white rounded-md bg-blue-500 hover:bg-blue-400">
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
          <div className="flex flex-col w-3/5 overflow-auto">
            <h4 className="pb-2 text-base text-center font-medium">Search Available Courses...</h4>
            <Input
              onChange={(event) => setSearchText(event.target.value)}
              className="w-3/5 h-8 place-self-center"
              type={"text"}
              value={searchText}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 100)}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Enter Course Code or Department..."
              variant={"blank"}
            />

            {/* List of CourseCards */}
            <div className="flex px-0 flex-col max-h-96 overflow-auto">
              {results.length > 0 && results.slice(0, 20).map((course) => (
                <CourseCard
                  addCourse={addCourse}
                  course={course}
                  key={Math.random()}
                />
              ))}

              {/* {exampleCourses.map((course) => (
                <CourseCard
                  addCourse={addCourse}
                  course={course}
                  key={Math.random()}
                />
              ))} */}
            </div>

            {/* Other Button Functionality */}
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2 p-6 place-content-center">
                <button className="w-40 h-10 place-self-end text-white rounded-md bg-blue-500 hover:bg-blue-400">
                  Export Plan to PDF
                </button>
              </div>
              <div className="flex flex-col w-1/2 p-6 place-content-center">
                <Link href="/view_plan">
                  <button className="w-40 h-10 place-self-start text-white rounded-md bg-blue-500 hover:bg-blue-400">
                    View Plan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : 
    (
      <>
        <div className="place-self-center">
          <h2 className="py-4 text-center font-medium">Degree Planner</h2>
          <p className="text-2xl pt-10 max-w-screen-md" >
            Terribly sorry, but you must be logged in to use the Degree Planner. 
            Please login to your existing account, or create a new account, login with it, 
            and try accessing this page again.
          </p>
        </div>
      </>
    );
};

export default Page;
