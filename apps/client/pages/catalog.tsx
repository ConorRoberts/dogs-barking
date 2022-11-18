import MetaData from "~/components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CloseIcon, LoadingIcon, PlusIcon } from "~/components/Icons";
import Course from "~/types/Course";
import Program from "~/types/Program";
import School from "~/types/School";
import CourseQueryApiResponse from "~/types/CourseQueryAPIResponse";
import CatalogCourse from "~/components/catalog/CatalogCourse";
import { Button, Input, Select, SelectOption } from "@conorroberts/beluga";
import ProgramQueryApiResponse from "~/types/ProgramQueryApiResponse";
import SchoolQueryApiResponse from "~/types/SchoolQueryApiResponse";
import CatalogProgram from "~/components/catalog/CatalogProgram";
import CatalogSchool from "~/components/catalog/CatalogSchool";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { CATALOG_SELECTION_OPTIONS, CATALOG_DEFAULT_FILTERS } from "~/config/config";

const Page = () => {
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState([]);

  const [totals, setTotals] = useState({ course: 0, program: 0, school: 0 });
  const [page, setPage] = useState(0);
  const [searchType, setSearchType] = useState("course");

  // const { filters } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const [currentFilterKey, setCurrentFilterKey] = useState("");
  const [currentFilterValue, setCurrentFilterValue] = useState("");
  const [comparatorValue, setComparatorValue] = useState("");

  // const validateUserInput = (filterValue: string, userInput: string, searchType: string) => {
  //   if (searchType === "course") {
  //     // validate course fields
  //     return validateUserCourseInput(filterValue, userInput);
  //   }
  //   if (searchType === "program") {
  //     // validate program fields
  //     return validateUserProgramInput(filterValue, userInput);
  //   }
  //   if (searchType === "school") {
  //     // validate school fields
  //     return validateUserSchoolInput(filterValue, userInput);
  //   }
  //   return false;
  // };

  const addNewFilter = (currentFilterKey: string, currentFilterValue: string) => {
    // if (!validateUserInput(currentFilterKey, currentFilterValue, searchType)) {
    //   alert("Invalid input detected... please try again");
    //   return;
    // }

    setCurrentFilterValue("");
    // dispatch(addFilter([currentFilterKey, currentFilterValue]));
  };

  const {
    data: coursePages,
    isSuccess: courseQuerySuccess,
    fetchNextPage,
  } = useInfiniteQuery(
    ["catalog", "courses"],
    async ({ pageParam }) => {
      const { data } = await axios.get<CourseQueryApiResponse>("/api/course", {
        params: {
          pageSize: 50,
          pageNum: pageParam,
          sortDir: "asc",
          ...Object.fromEntries(filters),
        },
      });

      return data.courses;
    },
    { getNextPageParam: (_, allPages) => Math.round(allPages.flat().length / 50) + 1 }
  );

  // TODO implement react window here
  const { data: programs } = useQuery(["catalog", "programs"], async () => {
    const { data } = await axios.get<ProgramQueryApiResponse>("/api/program", {
      params: {
        pageSize: 50,
        pageNum: page,
        sortDir: "asc",
        ...Object.fromEntries(filters),
      },
    });

    return [];
  });

  const { ref } = useInView({
    onChange: async (inView) => {
      if (inView) {
        fetchNextPage();
      }
    },
  });

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
              <div className="flex flex-col pb-6 w-40">
                <label className="pl-1 text-gray-800">Query</label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectOption value="" disabled textValue="None" />
                  <SelectOption value="course" textValue="Course" />
                  <SelectOption value="program" textValue="Program" />
                  <SelectOption value="school" textValue="School" />
                </Select>
              </div>
              <div className="flex flex-col pb-6 w-48">
                <label className="pl-1 text-gray-800">Filter Type</label>
                <Select value={currentFilterKey} onValueChange={setCurrentFilterKey}>
                  <SelectOption value="" disabled textValue="None" />
                  {CATALOG_DEFAULT_FILTERS[searchType].map((e) => (
                    <SelectOption value={e} textValue={e} key={`current filter key option ${e}`} />
                  ))}
                </Select>
              </div>
              {currentFilterKey === "level" && (
                <div className="flex flex-col pb-6 w-50">
                  <label className="pl-1 text-gray-800">Comparison</label>
                  {/* <Select value={comparatorValue} onChange={(e) => setComparatorValue(e.target.value)}>
                    <option value="" disabled>
                      None
                    </option> */}
                  {/* {CATALOG_COMPARATOR_OPTIONS.filter((e) => filters.every(([filter]) => filter !== e)).map(
                      (e, index) => (
                        <option key={`catalog filter key option ${index}`} value={e}>
                          {e}
                        </option>
                      )
                    )} */}
                  {/* </Select> */}
                </div>
              )}
              <Input
                className="bg-white dark:bg-gray-700 border border-gray-300"
                onChange={(e) => setCurrentFilterValue(e.target.value)}
                value={currentFilterValue}
                // placeholder={setFilterPlaceHolder(searchType, currentFilterKey)}
              />
              <PlusIcon
                size={25}
                className="border border-gray-300 rounded-full min-w-max"
                onClick={() => addNewFilter(currentFilterKey, currentFilterValue)}
              />
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              {/* {filters.map(([key, val], index) => (
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
              ))} */}
            </div>
          </div>
          {/* {searchType === "course" && (
            <p>
              {" "}
              Showing {50 * page} - {50 * page + 50} of {totals.course} results{" "}
            </p>
          )}
          {searchType === "program" && (
            <p>
              {" "}
              Showing {50 * page} - {50 * page + 50} of {totals.program} results{" "}
            </p>
          )}
          {searchType === "school" && (
            <p>
              {" "}
              Showing {50 * page} - {50 * page + 50} of {totals.school} results{" "}
            </p>
          )} */}
          {searchType === "course" && courseQuerySuccess && (
            <ul className="scrollbar scrollbar-track-y-transparent">
              {[...coursePages.pages.flat()]
                ?.sort((a, b) => a.code.localeCompare(b.code))
                .map((course) => (
                  <CatalogCourse key={course.id} course={course} />
                ))}
            </ul>
          )}
          {searchType === "program" && (
            <ul className="scrollbar scrollbar-track-y-transparent">
              {programs
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((program) => (
                  <CatalogProgram key={program.id} program={program} />
                ))}
            </ul>
          )}
          {/* {searchType === "school" && (
            <ul className="scrollbar scrollbar-track-y-transparent">
              {schools
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((school) => (
                  <CatalogSchool key={school.id} school={school} />
                ))}
            </ul>
          )} */}
        </div>
      )}
      <div ref={ref}></div>
    </div>
  );
};

export default Page;
