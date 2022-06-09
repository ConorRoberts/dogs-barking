import MetaData from "@components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CloseIcon, LoadingIcon, PlusIcon } from "@components/Icons";
import Program from "@typedefs/Program";
import Course from "@typedefs/Course";
import CourseQueryApiResponse from "@typedefs/CourseQueryAPIResponse";
import CatalogCourse from "@components/CatalogCourse";
import { Button, Input, Select } from "@components/form";
import { CATALOG_FILTER_OPTIONS } from "@config/config";
import { useDispatch, useSelector } from "react-redux";
import { addFilter, CatalogState, removeFilter } from "@redux/catalog";
import { RootState } from "@redux/store";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totals, setTotals] = useState({ course: 0, program: 0 });
  const [page, setPage] = useState(0);
  const { filters } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const [currentFilterKey, setCurrentFilterKey] = useState("");
  const [currentFilterValue, setCurrentFilterValue] = useState("");

  const dispatch = useDispatch();

  const type: "course" | "program" = "course";

  const submitQuery = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      setLoading(true);

      if (type === "course") {
        try {
          const { data } = await axios.get<CourseQueryApiResponse>("/api/course", {
            params: {
              pageSize: 50,
              pageNum: page,
              sortDir: "asc",
              ...Object.fromEntries(filters),
            },
          });
          setCourses(data.courses.sort((a, b) => a.code.localeCompare(b.code)));
          setTotals((prev) => ({ ...prev, course: data.total }));
        } catch (error) {
          setCourses([]);
        }
      }

      setLoading(false);
    },
    [page, filters]
  );

  useEffect(() => {
    submitQuery();
  }, [submitQuery]);

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-4xl w-full p-2">
      <MetaData title="Catalog" description="Search for courses and programs in our database." />
      <div className="text-center mb-8">
        <h1>Catalog</h1>
      </div>
      {loading && <LoadingIcon size={45} className="animate-spin text-gray-500 mx-auto" />}
      {!loading && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <Select value={currentFilterKey} onChange={(e) => setCurrentFilterKey(e.target.value)}>
                <option value="" disabled>
                  None
                </option>
                {CATALOG_FILTER_OPTIONS.map((e, index) => (
                  <option key={`catalog filter key option ${index}`} value={e} className="capitalize">
                    {e}
                  </option>
                ))}
              </Select>

              <Input
                className="bg-white dark:bg-gray-700 border border-gray-300"
                onChange={(e) => setCurrentFilterValue(e.target.value)}
                value={currentFilterValue}
              />
              <PlusIcon
                size={25}
                className="border border-gray-300 rounded-full"
                onClick={() => dispatch(addFilter([currentFilterKey, currentFilterValue]))}
              />
            </div>

            <div className="flex gap-4 items-center">
              {filters.map(([key, val], index) => (
                <div
                  className="bg-blue-500 rounded-full py-0.5 px-5 text-white capitalize"
                  key={`catalog filter ${index}`}
                >
                  <p>
                    {key}: {val}
                  </p>
                  <CloseIcon size={25} onClick={() => dispatch(removeFilter([key, val]))} />
                </div>
              ))}
            </div>
          </div>
          <p>
            Showing {50 * page} - {50 * page + 50} of {totals.course} results
          </p>
          <div className="flex gap-2 items-center justify-center">
            <Button variant="outline" onClick={() => setPage(page + 1)}>
              Next
            </Button>
            <Button variant="outline" onClick={() => setPage(page - 1 < 0 ? 0 : page - 1)}>
              Previous
            </Button>
          </div>
          <ul className="scrollbar scrollbar-track-y-transparent">
            {courses
              ?.sort((a, b) => a.code.localeCompare(b.code))
              .map((course) => (
                <CatalogCourse key={course.id} course={course} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;
