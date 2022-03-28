import { CatalogState, setPageState } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const getPageIndexArray = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

interface PageIndexProps {
  courses: number;
  programs: number;
}

const PageIndex = (counts: PageIndexProps) => {
  const { pageState, type } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const totalPages = counts[type];

  const pageIndex = {
    start: pageState.pageNum,
    end: totalPages > pageState.pageNum + 4 ? pageState.pageNum + 4 : totalPages,
  };
  const pageArray = getPageIndexArray(pageIndex.start, pageIndex.end);

  const dispatch = useDispatch();

  const incrementPage = (mode: string) => {
    if (mode === "<" && !(pageState.pageNum - 1 < 0)) {
      dispatch(setPageState({ ...pageState, pageNum: pageState.pageNum - 1 }));
    } else if (mode === ">" && !(pageState.pageNum + 1 > totalPages)) {
      dispatch(setPageState({ ...pageState, pageNum: pageState.pageNum + 1 }));
    } else if (mode === "<<") {
      if (pageState.pageNum - 10 < 1) {
        dispatch(setPageState({ ...pageState, pageNum: 1 }));
      } else {
        dispatch(setPageState({ ...pageState, pageNum: pageState.pageNum - 10 }));
      }
    } else if (mode === ">>") {
      if (pageState.pageNum + 10 > totalPages) {
        dispatch(setPageState({ ...pageState, pageNum: totalPages }));
      } else {
        dispatch(setPageState({ ...pageState, pageNum: pageState.pageNum + 10 }));
      }
    }
    if (pageState.pageNum > totalPages) {
      dispatch(setPageState({ ...pageState, pageNum: totalPages }));
    }
  };

  const changePage = (num: number) => {
    dispatch(
      setPageState({
        ...pageState,
        pageNum: num > totalPages ? totalPages : num,
      })
    );
  };

  return (
    <div className="flex flex-row text-center justify-between">
      <nav className="rounded text-sm divide-y divide-gray-300 dark:divide-gray-300">
        <div className="divide-x divide-gray-300">
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage("<<")}>
            {"<<"}
          </button>
          <button className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700" onClick={() => incrementPage("<")}>
            {"<"}
          </button>

          {pageArray.map((value: number) =>
            value == pageState.pageNum ? (
              <button
                className="px-3 hover:bg-sky-200 dark:hover:bg-gray-700 dark:bg-blue-500"
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
        <p>
          {pageState.pageNum} of {totalPages}
        </p>
      </nav>
    </div>
  );
};

export default PageIndex;
