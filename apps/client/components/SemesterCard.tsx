import CourseChip from "./CourseChip";
import { useDispatch, useSelector } from "react-redux";
import { PlannerState, setPlannedSemesters } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course, Semester } from "@typedefs/DegreePlan";


interface SemesterCardProps{
  semesterID : string;
  currentEditState : boolean;
  semesterName : string;
  timeOfYear : string;
  courses : Course[];
  year : string;
  index: number;
  viewPlan(): void;
}

const SemesterCard = (props : SemesterCardProps) => {
  const { semesterID } = props;
  let   { currentEditState } = props;
  const { semesterName } = props;
  const { timeOfYear } = props;
  const { courses } = props;
  const { year } = props;
  const { viewPlan } = props;

  const {
    plan: { semesters },
  } = useSelector<RootState, PlannerState>((state) => state.planner);
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const dispatch = useDispatch();

  const writeEditMode = (thisSemester: Semester, isEditing: boolean) => {
    const currentSemester = { ...thisSemester };
    currentSemester.isEditing = isEditing;
    return currentSemester;
  };

  const setEditMode = () => {
    const newSemesters = [...semesters];
    const semesterToEdit = { ...newSemesters.find((semester) => semester.id == semesterID) };
    const semEditData = { ...semesterToEdit };
    const newSemesterData = newSemesters.map((semester) =>
      semester.id === semesterID ? writeEditMode(semEditData, true) : writeEditMode(semester, false)
    );

    dispatch(setPlannedSemesters(newSemesterData));
  };

  const setUnEditMode = () => {
    const newSemesters = [...semesters];
    const semesterToEdit = { ...newSemesters.find((semester) => semester.id == semesterID) };
    const newSemData = { ...semesterToEdit };
    const newSemesterData = newSemesters.map((semester) =>
      semester.id === semesterID ? writeEditMode(newSemData, false) : semester
    );

    dispatch(setPlannedSemesters(newSemesterData));
  };

  const editClick = () => {
    currentEditState = true;
    setEditMode();
  };

  const editFinishClick = () => {
    currentEditState = false;
    setUnEditMode();
  };

  const removeSemesterClick = (semesterID: string) => {
    dispatch(setPlannedSemesters(semesters.filter((semester) => semester.id !== semesterID)));
    viewPlan();
  };

  const removeCourse = (courseID: string) => {
    const newSemesters = [...semesters];
    const semesterToEdit = { ...newSemesters.find((semester) => semester.id == semesterID) };
    semesterToEdit.courses = semesterToEdit.courses.filter((course) => course.id !== courseID);
    const newSemesterData = newSemesters.map((semester) => (semester.id === semesterID ? semesterToEdit : semester));

    dispatch(setPlannedSemesters(newSemesterData));
  };

  return (
    <div className=" py-1 flex flex-row gap-2 bg-neutral-300 content-center place-self-center mx-5 my-2 rounded-md w-full">
      <div className="py-1 flex flex-col w-full">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-1/2">
            <h4 className="pl-2 py-1 text-base place-self-start font-semibold">
              {semesterName} - {timeOfYear} {year}
            </h4>
          </div>
          <div className="flex flex-col place-self-end place-content-end w-1/2">
            {currentEditState ? (
              <div className="flex flex-row w-full place-self-end place-content-end pr-0 mr-0">
                <button
                  onClick={() => removeSemesterClick(semesterID)}
                  className="w-40 h-8 px-2 mr-10 self-end text-white rounded-md bg-red-600 hover:bg-red-400">
                  Remove Semester
                </button>
                <button className="w-20 h-8 px-2 mr-5 text-white rounded-md bg-slate-400" disabled>
                  Editing...
                </button>
              </div>
            ) : (
              <div className="flex flex-row place-self-end place-content-end w-full pr-0 mr-0">
                <button
                  onClick={editClick}
                  className="w-16 h-8 mr-5 place-self-end text-white rounded-md bg-blue-500 hover:bg-blue-400">
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
        {currentEditState &&
          courses.map((course) => (
            <CourseChip
              course={course}
              removeCourse={removeCourse}
              isEditing={currentEditState}
              viewPlan={viewPlan}
              key={course.id + Math.random().toString()}
            />
          ))}
        {!currentEditState &&
          courses.map((course) => (
            <CourseChip
              course={course}
              removeCourse={removeCourse}
              isEditing={currentEditState}
              viewPlan={viewPlan}
              key={course.id + Math.random().toString()}
            />
          ))}
        {currentEditState ? (
          <button
            onClick={editFinishClick}
            className="w-16 h-8 mt-1 mr-5 place-self-end text-white rounded-md bg-green-400 hover:bg-green-500">
            Finish
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SemesterCard;
