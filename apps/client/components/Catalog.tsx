import Course from "@dogs-barking/common/types/Course";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import PageIndex from "@components/PageIndex";
import LoadingScreen from "./LoadingScreen";
import Link from "next/link";
import { CatalogState, setPageState } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const Catalog = (props) => {
  const { type, query } = props;
  const totalCourses = 6339;
  const totalPrograms = 467;
  const [courseList, setCourseList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { filters, pageState, updatePage } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    (async () => {
      let newListContent = [];
      if (type === "courses") {
        if (pageState.useFilter || query !== "") {
          if (query !== "") {
            // If user searches using search bar
            const { data: courses } = await axios.get(`/api/course/search/`, {
              params: { courseId: query, pageSize: pageState.pageSize, pageNum: pageState.pageNum },
            });
            newListContent = courses;
            setCourseList(newListContent);
          } else {
            // If user filters using filter options
            const { data: courses } = await axios.get(`/api/course/query/`, {
              params: { filters: filters, pageSize: pageState.pageSize, pageNum: pageState.pageNum },
            });
            newListContent = courses;
            setCourseList(newListContent);
          }
        } else {
          // No filters/queries at all, then default fetch all courses (while limiting pageSize and pageNum)
          const { data: courseObj } = await axios.get("/api/course/", {
            params: { pageSize: pageState.pageSize, pageNum: pageState.pageNum },
          });
          const courses = courseObj.data;
          newListContent = courses;
          setCourseList(newListContent);
        }
      } else {
        // Currently only fetchs all programs and displays it
        const { data: programs } = await axios.get("/api/program", {
          params: { pageSize: pageState.pageSize, pageNum: pageState.pageNum },
        });
        newListContent = programs.data;
        setProgramList(newListContent);
      }

      dispatch(setPageState({
        ...pageState,
        totalPages: Math.ceil(totalCourses / pageState.pageSize)
      }));
      setLoading(false);
    })();
  }, [query, type, updatePage]);

  if (loading) {
    return <LoadingScreen />;
  } else if (type === "courses") {
    // Return html for course catalog
    return (
      <div>
        <ul className="divide-slate-200 dark:divide-slate-600 divide-y overflow-y-scroll h-screen box-content scrollbar
                      scrollbar-track-y-transparent">
          {(courseList.length === 0) 
            ? <p className="text-lg">No more courses to show...</p> 
            : courseList.map((course: Course) => (
              <div
                className="py-2 hover:bg-sky-200 even:bg-slate-200 dark:hover:bg-gray-700 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:opacity-90"
                key={course.id}>
                {
                  <li>
                    <a href={"/course/" + course.nodeId}>
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
          <PageIndex />
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
