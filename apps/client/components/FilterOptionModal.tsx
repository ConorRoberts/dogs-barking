import { useEffect, useState } from "react";
import Course, { SemestersOffered } from "@dogs-barking/common/types/Course";
import { CourseScope, Query, SortMode } from "@dogs-barking/common/types/Input";
import SearchField from "@components/SearchField";
import { Close } from "./Icons";

const initialQuery: Query = {
  degree: "",
  major: "",
  department: "",
  coursecode: "",
  school: "",
  weight: -1,
  coursenum: -1,
  level: -1,
  prerequisite: [],
  semester: [],
  title: [],
  path: false,
  options: {
    SortMode: "Raw",
    SortDirection: "Ascending",
    Scope: "All",
    PrintMode: "Regular",
  },
};

const FilterOptionModal = (props) => {
  const { setShowFilterOptions, setFilterOptions, setUseFilter } = props;

  /**Query Search State */

  const [searchResult, setSearchResult] = useState<Course[] | null>(null);
  const [queryParams, setQueryParams] = useState<Query | null>(initialQuery);
  const [queryActive, setQueryActive] = useState<boolean>(false);
  /* Ref: types/input */
  const [degree, setDegree] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  /* Number types/input */
  const [weight, setWeight] = useState<number>(-1);
  const [courseNum, setCourseNum] = useState<number>(-1);
  const [level, setLevel] = useState<number>(-1);
  /* String[] types/input */
  const [prereq, setPrereq] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [semester, setSemester] = useState<SemestersOffered[]>([]);
  /* Auxillary types/input */
  const [sortMode, setSortMode] = useState<SortMode>("Raw");
  const [scope, setScope] = useState<CourseScope>("All");

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

  const clearFilters = () => {
    setDegree("");
    setMajor("");
    setDepartment("");
    setCourseCode("");
    setSchool("");
    updatePrereqs("");
    updateKeywords("");
    setUseFilter({ filter: false });
  };

  const generateQuery = () => {
    setFilterOptions(queryParams);
    setUseFilter({ filter: true });
  };

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      degree: degree,
      major: major,
      department: department,
      school: school,
      weight: weight,
      coursenum: courseNum,
      level: level,
      prerequisite: prereq,
      semester: semester,
      options: {
        ...queryParams.options,
        Scope: scope,
      },
    });
  }, [degree, major, department, school, weight, courseNum, level, prereq, semester, keywords, scope, sortMode]);

  return (
    <div
      className="absolute right-4 top-4 bottom-4 overflow-y-auto overflow-x-hidden w-96 bg-white dark:bg-gray-800 backdrop-filter bg-opacity-80 
                                backdrop-blur-sm z-30 border border-gray-100 rounded-xl p-2 shadow-md flex flex-col gap-4">
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
