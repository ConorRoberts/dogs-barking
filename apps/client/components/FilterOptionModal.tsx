import { useEffect, useState } from "react";
import Course, { SemestersOffered } from "@dogs-barking/common/types/Course";
import { CourseScope, Query, SortMode } from "@dogs-barking/common/types/Input";
import SearchField from "@components/SearchField";
import { Close } from "./Icons";
import { CatalogState, setFilters, setPageState } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const FilterOptionModal = (props) => {
  const { setShowFilterOptions } = props;

  /* Ref: types/input */
  const [degree, setDegree] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  /* Number types/input */
  const [weight, setWeight] = useState<number>(0);
  const [courseNum, setCourseNum] = useState<number>(0);
  const [level, setLevel] = useState<number>(-1);
  /* String[] types/input */
  const [prereq, setPrereq] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [semester, setSemester] = useState<SemestersOffered[]>([]);
  /* Auxillary types/input */
  const [sortMode, setSortMode] = useState<SortMode>("Raw");
  const [scope, setScope] = useState<CourseScope>("All");

  const { filters, pageState } = useSelector<RootState, CatalogState>((state) => state.catalog);

  // update query state, cancel refresh of page
  // const activateQuery = (e) => {
  //   e.preventDefault();
  //   setQueryActive(true);
  // };

  // parse and update prereq state
  const updatePrereqs = (prq) => {
    const prqs = prq.split(",");
    setPrereq(prqs);
  };

  const updateSem = (sem) => {
    const semesters: SemestersOffered[] = sem.split(",");
    setSemester(semesters);
  };

  // parse and update keyword state
  const updateKeywords = (keywords) => {
    const kwords = keywords.split(" ");
    setKeywords(kwords);
  };
  const dispatch = useDispatch();

  const clearFilters = () => {
    setDegree("");
    setMajor("");
    setDepartment("");
    setCourseCode("");
    setSchool("");
    setWeight(0);
    setCourseNum(0);
    updatePrereqs("");
    updateKeywords("");
    dispatch(setPageState({
      ...pageState,
      useFilter: false
    }));
  };


  const generateQuery = () => {
    const newFilters = {
      ...filters,
      courseId: (courseCode !== "") ? courseCode : "",
      school: (school !== "") ? school : "",
      number: (courseNum !== 0) ? courseNum : null,
      //description: "",
      prerequisites: (prereq.length === 0) ? prereq : [],
      department: (department !== "") ? department : "",
      name: "",
      weight: (weight !== 0) ? weight : null,
      degree: (degree !== "") ? degree : "",
      useFilter: true
    };
    dispatch(setFilters(newFilters));
    dispatch(setPageState({
      ...pageState,
      useFilter: true
    }));
    console.log("Query Generated");
  };

  return (
    <div
      className="">
      <Close
        className="w-8 h-8 transition cursor-pointer hover:text-gray-600 text-black dark:text-white ml-auto p-1"
        onClick={() => setShowFilterOptions(false)}
      />
      <h3 className="text-center">Filter Options</h3>
      <div className="grid grid-cols-2">
        <SearchField title={"Degree"} type={"search"} setState={setDegree} value={degree} />
        <SearchField title={"Major"} type={"text"} setState={setMajor} value={major} />
        <SearchField title={"Department"} type={"text"} setState={setDepartment} value={department} />
        {/*<SearchField title={"Course Code"} type={"text"} setState={setCourseCode} value={courseCode} />*/}
        <SearchField title={"School"} type={"text"} setState={setSchool} value={school} />
        <SearchField title={"Weight"} type={"number"} setState={setWeight} />
        <SearchField title={"Course Number"} type={"number"} setState={setCourseNum} />
        <SearchField title={"Level"} type={"number"} setState={setLevel} />
        <SearchField title={"Prerequisites"} type={"text"} setState={updatePrereqs} value={prereq} />
        <SearchField title={"Semester [S, F, W]"} type={"text"} setState={updateSem} value={semester} />
        <SearchField title={"Keywords"} type={"text"} setState={updateKeywords} value={keywords} />
      </div>
      <div>
        <p className="text-xs text-left">*Separate prerequisites by commas (e.g - CIS3750,CIS3760)</p>
      </div>
      <div className="rounded grid grid-cols-3 text-center text-lg divide-x-2 divide-slate-500 border-2 border-solid border-slate-500">
        {scope === "All" ? (
          <button className="dark:hover:bg-gray-700 dark:bg-opacity-25 bg-blue-300" onClick={() => setScope("All")}>
            All
          </button>
        ) : (
          <button className="dark:hover:bg-gray-700 hover:bg-sky-200" onClick={() => setScope("All")}>
            All
          </button>
        )}
        {scope === "Grad" ? (
          <button className="dark:hover:bg-gray-700 dark:bg-opacity-25 bg-blue-300" onClick={() => setScope("Grad")}>
            Grad
          </button>
        ) : (
          <button className="dark:hover:bg-gray-700 hover:bg-sky-200" onClick={() => setScope("Grad")}>
            Grad
          </button>
        )}
        {scope === "Undergrad" ? (
          <button
            className="dark:hover:bg-gray-700 dark:bg-opacity-25 bg-blue-300"
            onClick={() => setScope("Undergrad")}>
            Undergrad
          </button>
        ) : (
          <button className="dark:hover:bg-gray-700 hover:bg-sky-200" onClick={() => setScope("Undergrad")}>
            Undergrad
          </button>
        )}
      </div>
      <div className="divide-x-4">
        <button className="rounded bg-blue-400 py-2 px-4" onClick={generateQuery}>
          Submit
        </button>
        <button className="rounded bg-blue-400 py-2 px-4" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterOptionModal;
