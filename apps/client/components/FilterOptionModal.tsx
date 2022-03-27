import { useEffect, useState } from "react";
import Course, { SemestersOffered } from "@dogs-barking/common/types/Course";
import { CourseScope, Query, SortMode } from "@dogs-barking/common/types/Input";
import SearchField from "@components/SearchField";
import { Close } from "./Icons";
import { CatalogState, setFilters, setPageState, setUpdatePage } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { AiOutlineDown } from "react-icons/ai"
import FilterOption from "./FilterOption";

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
  const [level, setLevel] = useState<number>(0);
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
    dispatch(setUpdatePage({
      update: true
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
    dispatch(setUpdatePage({
      update: true
    }));
  };

  const setOrder = (val: string) => {
    const sortDir = (val.includes("Asc")) ? "asc" : "desc";
    const sortKey = (val.includes("name")) ? "id" : "weight";
    dispatch(setFilters({
      ...filters,
      sortDir: sortDir,
      sortKey: sortKey,
    }));
    dispatch(setPageState({
      ...pageState,
      useFilter: true
    }));
    dispatch(setUpdatePage({
      update: true
    }));
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-row">
          <p className="pr-2">Sort By:</p>
          <select
            id="sortBy"
            className="dark:bg-inherit border-2 border-slate-600 rounded dark:text-gray-400 w-28 h-6"
            onChange={(e) => setOrder(e.target.value)}>
            <option>-</option>
            <option value="nameAsc">Course Code: A-Z</option>
            <option value="nameDesc">Course Code: Z-A</option>
            <option value="weightAsc">Weight: Ascending</option>
            <option value="weightDesc">Weight: Descending</option>
          </select>
        </div>
        <div className="flex flex-row">
          <p className="px-2">Items Per Page:</p>
          <select
            id="itemsPerPage"
            className="dark:bg-inherit border-2 border-slate-600 rounded dark:text-gray-400 w-28 h-6"
            onChange={() => {
              const e = document.getElementById("itemsPerPage") as HTMLSelectElement;
              const val = parseInt(e.options[e.selectedIndex].value);

              dispatch(setPageState({
                ...pageState,
                pageSize: val
              }));
            }}>
            <option>-</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>
      <br />
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
      <br />
      <h4 className="text-center">Filters</h4>
      <div className="grid">
        <ul className="divide-slate-200 dark:divide-slate-600 divide-y box-content">
          <FilterOption name="Degree" setState={setDegree} value={degree} type="text"/>
          <FilterOption name="Major" setState={setMajor} value={major} type="text"/>
          <FilterOption name="Department" setState={setDepartment} value={department} type="text"/>
          <FilterOption name="School" setState={setSchool} value={school} type="text"/>
          <FilterOption name="Weight" setState={setWeight} value={weight} type="number"/>
          <FilterOption name="Course Number" setState={setCourseNum} value={courseNum} type="number"/>
          <FilterOption name="Level" setState={setLevel} value={level} type="number"/>
          <FilterOption name="Prerequisites" setState={setPrereq} value={prereq} type="text"/>
          <FilterOption name="Semesters" setState={setSemester} value={semester} type="text"/>
          <FilterOption name="Keywords" setState={setKeywords} value={keywords} type="text"/>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-32 py-4">
        <button className="rounded bg-blue-400 p-2" onClick={generateQuery}>
          Submit
        </button>
        <button className="rounded bg-blue-400 p-2" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterOptionModal;
