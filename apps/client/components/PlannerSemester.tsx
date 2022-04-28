import useSearch from "@hooks/useSearch";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import Link from "next/link";
import { useState } from "react";
import { Button, Input, Modal } from "./form";
import { PlusIcon, Random } from "./Icons";

const PlannerSemester = (props: PlannerSemesterData) => {
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { results } = useSearch(searchText);
  return (
    <div>
      {showCourseSelect && (
        <Modal onClose={() => setShowCourseSelect(false)}>
          <div className="relative mx-auto max-w-xl w-full">
            <h3 className="text-xl font-normal text-center mb-2">Find your favourite courses</h3>

            <div
              className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-t-md ${
                showResults && results.length > 0 ? "rounded-b-none" : "rounded-b-md"
              }`}>
              <Input
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                placeholder="Course code"
                className={`py-3 text-xl font-light w-full dark:bg-gray-800`}
                onBlur={() => setTimeout(() => setShowResults(false), 100)}
                onFocus={() => setShowResults(true)}
                variant="blank"
              />
            </div>
            {showResults && (
              <div className="absolute rounded-b-xl top-full left-0 right-0 z-10 shadow-md bg-white overflow-hidden divide-y divide-gray-100">
                {results.slice(0, 10).map((e) => (
                  <div
                    className="bg-white dark:bg-gray-800 px-4 py-0.5 bg-opacity-90 backdrop-filter backdrop-blur-sm hover:text-gray-500 dark:hover:text-gray-300 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16"
                    key={e.id}>
                    <p>{e.code}</p>
                    <p className="truncate">{e.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
      <h3 className="capitalize">
        {props.semester} &apos;{props.year % 2000}
      </h3>

      <Button variant="outline" onClick={() => setShowCourseSelect(true)}>
        <PlusIcon size={20} />
        <p>Add Course</p>
      </Button>
    </div>
  );
};

export default PlannerSemester;
