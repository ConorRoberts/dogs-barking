import MetaData from "@components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CloseIcon, LoadingIcon, PlusIcon } from "@components/Icons";
// import Program from "@typedefs/Program";
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
  // const [programs, setPrograms] = useState<Program[]>([]);
  const [totals, setTotals] = useState({ course: 0, program: 0 });
  const [page, setPage] = useState(0);
  const { filters } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const [currentFilterKey, setCurrentFilterKey] = useState("");
  const [currentFilterValue, setCurrentFilterValue] = useState("");

  const setFilterPlaceHolder = (placeholderValue:string) => {
    switch (placeholderValue) {
      case "code":
        return "Enter a course code, valid formats: CIS1300 ENGG1500 PSYC2000 HROB2010";
      case "number":
        return "Enter a course number, can range from 0-9999";
      case "name":
        return "Enter a course name, ie: Taxation or Into to financial accounting";
      case "description":
        return "Enter keyword(s)";
      default:
        return "Enter a search value";
    }
  };

  const validateCourseCode = (courseCode:string) => { // validates a course code
    const courseCodeRegex = /^[A-Z]{3,4}(\d{4})$/;
    const courseNumber = courseCodeRegex.test(courseCode) ? courseCodeRegex.exec(courseCode)[1] : undefined;
    return courseCodeRegex.test(courseCode) && parseInt(courseNumber) >= 1000 && parseInt(courseNumber) <= 9999;
  };

  const validateUserInput = (filterValue:string, userInput: any) => { // special validation for specific input types, will be added onto later
    switch (currentFilterKey) {
      case "code":
        return validateCourseCode(userInput);
      case "number":
        return /^\d+$/.test(userInput) && parseInt(userInput) >= 0 && parseInt(userInput) <= 9999;
      default:
        return true;
    }
  };

  const addNewFilter = (currentFilterKey:any, currentFilterValue:any) => {

    if (!validateUserInput(currentFilterKey, currentFilterValue)) {
      switch(currentFilterKey) {
        case "code":
          alert("Invalid course code entered... Please enter a course code in the form: CIS1300 or ENGG1500");
          break;
        case "number":
          alert("Input is not a number or out of bounds, please enter a number between 0 and 9999");
          break;
      }
      return;
    }

    setCurrentFilterValue("");
    dispatch(addFilter([currentFilterKey, currentFilterValue]));
  };

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
              <div className="flex flex-col pb-6">
                <label className="pl-1 text-gray-800 underline">Filter Type</label>
                <Select value={currentFilterKey} onChange={(e) => setCurrentFilterKey(e.target.value)}>
                  <option value="" disabled>
                    None
                  </option>
                  {CATALOG_FILTER_OPTIONS.filter((e) => filters.every(([filter]) => filter !== e)).map((e, index) => (
                    <option key={`catalog filter key option ${index}`} value={e} className="capitalize">
                      {e}
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                className="bg-white dark:bg-gray-700 border border-gray-300"
                onChange={(e) => setCurrentFilterValue(e.target.value)}
                value={currentFilterValue}
                placeholder={setFilterPlaceHolder(currentFilterKey)}
              />
              <PlusIcon
                size={25}
                className="border border-gray-300 rounded-full min-w-max"
                onClick={() => addNewFilter(currentFilterKey, currentFilterValue)}
              />
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              {filters.map(([key, val], index) => (
                <div
                  className="rounded-full capitalize flex overflow-hidden items-center group shadow-md"
                  key={`catalog filter ${index}`}
                >
                  <div className="dark:bg-gray-700 bg-white shadow-md py-0.5 flex items-center px-2 sm:px-4 ">
                    <CloseIcon
                      className="w-0 h-0 group-hover:w-5 group-hover:h-5 transition-all group-hover:mr-2 primary-hover"
                      onClick={() => {
                        setCurrentFilterValue("");
                        dispatch(removeFilter([key, val]));
                      }}
                    />
                    <p className="text-sm sm:text-base">{key}</p>
                  </div>
                  <p className="px-2 sm:px-4 py-0.5 bg-blue-500 dark:bg-blue-800 text-white text-sm sm:text-base">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p>
            Showing {50 * page} - {50 * page + 50} of {totals.course} results
          </p>
          <div className="flex gap-2 items-center justify-end">
            <Button variant="outline" onClick={() => setPage(page - 1 < 0 ? 0 : page - 1)}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => setPage(page + 1)}>
              Next
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
