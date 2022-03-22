import Course from "@dogs-barking/common/types/Course";
import axios from "axios";
import { useEffect, useState } from "react";
import PageIndex from "@components/PageIndex";
import LoadingScreen from "./LoadingScreen";
import FilterOptions from "./FilterOptions";
import { Query, SortDir, SortMode } from "@dogs-barking/common/types/Input";
import Link from "next/link";

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

const Catalog = (props) => {
  const { type, query } = props;
  const totalCourses = 6339;
  const totalPrograms = 467;
  const [courseList, setCourseList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(50);

  const [coursesPerPage, setCoursesPerPage] = useState(50);

  const [filterOptions, setFilterOptions] = useState<Query>(initialQuery);
  const [useFilter, setUseFilter] = useState({ filter: false });
  const [sortDir, setSortDir] = useState<SortDir>("Ascending");
  const [sortMode, setSortMode] = useState<SortMode>("Raw");

  useEffect(() => {
    setFilterOptions({
      ...filterOptions,
      options: {
        ...filterOptions.options,
        SortDirection: sortDir,
        SortMode: sortMode,
      },
    });
    setUseFilter({ filter: true });
  }, [sortDir, sortMode]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let newListContent = [];
      if (type === "courses") {
        if (useFilter.filter || query !== "") {
          if (query !== "") {
            // If user searches using search bar
            const { data: courses } = await axios.get(`/api/course/search/`, {
              params: { courseId: query, pageSize: coursesPerPage, pageNum: currentPage },
            });
            if (courses.length < coursesPerPage) {
              setTotalPages(1);
            }
            newListContent = courses;
            setCourseList(newListContent);
          } else {
            // If user filters using filter options
            const { data: courses } = await axios.get(`/api/db/course/search/`, {
              params: { courseId: query, pageSize: coursesPerPage, pageNum: currentPage, filters: filterOptions },
            });
            if (courses.length < coursesPerPage) {
              setTotalPages(1);
            }
            newListContent = courses;
            setCourseList(newListContent);
          }
        } else {
          // No filters/queries at all, then default fetch all courses (while limiting pageSize and pageNum)
          const { data: courseObj } = await axios.get("/api/db/course", {
            params: { pageSize: coursesPerPage, pageNum: currentPage },
          });
          const courses = courseObj.data;
          newListContent = courses;
          setCourseList(newListContent);
        }
      } else {
        // Currently only fetchs all programs and displays it
        const { data: programs } = await axios.get("/api/db/programs", {
          params: { pageSize: coursesPerPage, pageNum: currentPage },
        });
        newListContent = programs.data;
        setProgramList(newListContent);
      }

      if (useFilter || query !== "") {
        setTotalPages(Math.ceil(totalCourses / coursesPerPage));
      } else if (newListContent.length < coursesPerPage) {
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil(newListContent.length / coursesPerPage));
      }
      setLoading(false);
    })();
  }, [query, currentPage, coursesPerPage, type, useFilter]);

  useEffect(() => {
    setCurrentPage(0);
  }, [useFilter]);

  if (loading) {
    return <LoadingScreen />;
  } else if (type === "courses") {
    // Return html for course catalog
    return (
      <div>
        <div className="grid grid-cols-2">
          <PageIndex
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setCoursesPerPage={setCoursesPerPage}
          />
          <div className="text-center">
            <FilterOptions
              setCoursesPerPage={setCoursesPerPage}
              setFilterOptions={setFilterOptions}
              setUseFilter={setUseFilter}
              useFilter={useFilter}
              setSortBy={setSortDir}
              setSortMode={setSortMode}
            />
          </div>
        </div>
        <ul className="divide-slate-200 dark:divide-slate-600 divide-y overflow-auto h-screen box-content">
          {courseList.map((course: Course) => (
            <div
              className="py-2 hover:bg-sky-200 even:bg-slate-200 dark:hover:bg-gray-700 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:opacity-90"
              key={course.id}>
              {
                <li>
                  <a href={"/catalog/" + `${/([A-Z]{3,4}[0-9]{4})/.test(course.id) ? "UOFG" : "UOFT"}/` + course.id}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{course.id}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {course.name} - [{course.weight.toFixed(2)}]
                    </p>
                  </a>
                </li>
              }
            </div>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        {
          <PageIndex
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setCoursesPerPage={setCoursesPerPage}
          />
        }
        <ul className="divide-slate-200 dark:divide-slate-600 divide-y overflow-auto h-screen box-content">
          {programList.map((program) => (
            <Link key={program.nodeId} href={`/programs/${program.nodeId}`}>
              <div className="py-2 hover:bg-sky-200 even:bg-slate-200 dark:hover:bg-gray-700 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:opacity-90">
                <li>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {program.id + " - " + program.degree}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate"> {program.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{program.school}</p>
                </li>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    );
  }
};

export default Catalog;
