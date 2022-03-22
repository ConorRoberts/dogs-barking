import { useEffect, useState } from "react";
import { CourseScope } from "@dogs-barking/common/types/Input";
import { MdOutlineFilterAlt } from "react-icons/md";
import FilterOptions from "./FilterOptions";

const getPageIndexArray = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

const PageIndex = ({ currentPage, totalPages, setCurrentPage, setCoursesPerPage }) => {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [pageIndex, setPageIndex] = useState({
    start: currentPage,
    end: totalPages > currentPage + 4 ? currentPage + 4 : totalPages,
  });
  const [pageArray, setPageArray] = useState(getPageIndexArray(pageIndex.start, pageIndex.end));

  const changePage = (mode: string) => {
    if (mode === "<" && !(currentPage - 1 < 0)) {
      setCurrentPage(currentPage - 1);
    } else if (mode === ">" && !(currentPage + 1 > totalPages)) {
      setCurrentPage(currentPage + 1);
    } else if (mode === "<<") {
      if (currentPage - 10 < 1) {
        setCurrentPage(1);
      } else {
        setCurrentPage(currentPage - 10);
      }
    } else if (mode === ">>") {
      if (currentPage + 10 > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(currentPage + 10);
      }
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  return (
    <div className="flex flex-row text-center justify-between">
      <nav className="rounded content-center text-sm divide-y-2 divide-slate-900 dark:divide-slate-600 border-2 border-solid border-slate-600 max-h-12">
        <div className="divide-x-2 divide-slate-600">
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => changePage("<<")}>
            {"<<"}
          </button>
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => changePage("<")}>
            {"<"}
          </button>

          {pageArray.map((value: number) =>
            value == currentPage ? (
              <button
                className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700 bg-blue-300 dark:bg-opacity-25"
                key={"page-" + value}
                onClick={() => setCurrentPage(value)}>
                {value}
              </button>
            ) : (
              <button
                className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700"
                key={"page-" + value}
                onClick={() => setCurrentPage(value)}>
                {value}
              </button>
            )
          )}

          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => changePage(">")}>
            {">"}
          </button>
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => changePage(">>")}>
            {">>"}
          </button>
        </div>
        <p className="px-2 opacity-50">
          {currentPage} of {totalPages}
        </p>
      </nav>
    </div>
  );
};

export default PageIndex;
