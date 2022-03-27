import { useEffect, useState } from "react";
import { CatalogState, setPageState, setUpdatePage } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const getPageIndexArray = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

const PageIndex = () => {
  const { pageState } = useSelector<RootState, CatalogState>((state) => state.catalog);
  let currentPage = pageState.pageNum;
  const totalPages = pageState.totalPages;

  const pageIndex = {
    start: currentPage,
    end: totalPages > currentPage + 4 ? currentPage + 4 : totalPages,
  };
  const pageArray = getPageIndexArray(pageIndex.start, pageIndex.end);

  const dispatch = useDispatch();

  const incrementPage = (mode: string) => {
    if (mode === "<" && !(currentPage - 1 < 0)) {
      currentPage = currentPage - 1;
    } else if (mode === ">" && !(currentPage + 1 > totalPages)) {
      currentPage = (currentPage + 1);
    } else if (mode === "<<") {
      if (currentPage - 10 < 1) {
        currentPage = 1;
      } else {
        currentPage = currentPage - 10;
      }
    } else if (mode === ">>") {
      if (currentPage + 10 > totalPages) {
        currentPage = totalPages;
      } else {
        currentPage = currentPage + 10;
      }
    }
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    dispatch(setPageState({
      ...pageState,
      pageNum: currentPage
    }));
    dispatch(setUpdatePage({
      update: true
    }));
  };

  const changePage = (num: number) => {
    let pageNum = num;
    if (num > totalPages) {
      pageNum = totalPages;
    }
    dispatch(setPageState({
      ...pageState,
      pageNum: pageNum
    }));
    dispatch(setUpdatePage({
      update: true
    }));
  };

  return (
    <div className="flex flex-row text-center justify-between">
      <nav className="rounded content-center text-sm divide-y-2 divide-slate-900 dark:divide-slate-600 border-2 border-solid border-slate-600 max-h-12">
        <div className="divide-x-2 divide-slate-600">
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage("<<")}>
            {"<<"}
          </button>
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage("<")}>
            {"<"}
          </button>

          {pageArray.map((value: number) =>
            value == currentPage ? (
              <button
                className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700 bg-blue-300 dark:bg-opacity-25"
                key={"page-" + value}
                onClick={() => changePage(value)}>
                {value}
              </button>
            ) : (
              <button
                className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700"
                key={"page-" + value}
                onClick={() => changePage(value)}>
                {value}
              </button>
            )
          )}

          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage(">")}>
            {">"}
          </button>
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage(">>")}>
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
