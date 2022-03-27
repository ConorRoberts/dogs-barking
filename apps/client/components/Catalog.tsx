import axios from "axios";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import Link from "next/link";
import { CatalogState, setPageState } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const Catalog = (props) => {
  const { type, query } = props;
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

      dispatch(
        setPageState({
          ...pageState,
          totalPages: Math.ceil(pageState.pageSize),
        })
      );
      setLoading(false);
    })();
  }, [query, type, updatePage]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <ul
        className="divide-slate-200 dark:divide-slate-600 divide-y overflow-y-scroll h-screen box-content scrollbar
                      scrollbar-track-y-transparent">
        {courseList.length === 0 ? (
          <p className="text-lg">No more courses to show...</p>
        ) : (
          courseList.map((e) => (
            <div
              className="py-2 hover:bg-sky-200 even:bg-slate-200 dark:hover:bg-gray-700 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:opacity-90"
              key={e.id}>
              {
                <li>
                  <Link href={"/course/" + e.nodeId}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{e.id}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {e.name} {type === "course" && `- [${e.weight.toFixed(2)}]`}
                    </p>
                    {type === "program" && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate"> {e.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{e.school}</p>
                      </>
                    )}
                  </Link>
                </li>
              }
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default Catalog;
