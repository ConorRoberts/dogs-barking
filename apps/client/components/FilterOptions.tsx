import { useState } from "react";
import FilterOptionModal from "./FilterOptionModal";
import { MdOutlineFilterAlt } from "react-icons/md";
import { CatalogState, setFilters, setPageState } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";

const FilterOptions = () => {
  const { filters, pageState } = useSelector<RootState, CatalogState>((state) => state.catalog);

  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const dispatch = useDispatch();

  const setOrder = (val) => {
    const sortDir = (val.includes("Asc")) ? "asc" : "desc";
    const sortKey = (val.includes("name")) ? "id" : "weight";
    dispatch(setFilters({
      ...filters,
      sortDir: sortDir,
      sortKey: sortKey,
    }));
    dispatch(setPageState({
      ...pageState,
      useFilter: true
    }));
  };

  return (
    <div>
      <div>
        <button className="rounded border-2 border-slate-600" onClick={() => setShowFilterOptions(true)}>
          <MdOutlineFilterAlt size={25}></MdOutlineFilterAlt>
        </button>
      </div>
      {showFilterOptions ? (
        <FilterOptionModal setShowFilterOptions={setShowFilterOptions}/>
      ) : (
        <></>
      )}
      <div className="flex flex-col">
        <div className="flex pt-2">
          <div className="flex flex-row">
            <p className="pr-2">Sort By:</p>
            <select
              id="sortBy"
              className="dark:bg-inherit border-2 border-slate-600 rounded dark:text-gray-400 w-28 h-6"
              onChange={(e) => setOrder(e.target.value)}>
              <option>-</option>
              <option value="nameAsc">Course Code: A-Z</option>
              <option value="nameDesc">Course Code: Z-A</option>
              <option value="weightAsc">Weight: Ascending</option>
              <option value="weightDesc">Weight: Descending</option>
            </select>
          </div>
          <div className="flex flex-row">
            <p className="px-2">Items Per Page:</p>
            <select
              id="itemsPerPage"
              className="dark:bg-inherit border-2 border-slate-600 rounded dark:text-gray-400 w-28 h-6"
              onChange={() => {
                const e = document.getElementById("itemsPerPage") as HTMLSelectElement;
                const val = parseInt(e.options[e.selectedIndex].value);

                dispatch(setPageState({
                  ...pageState,
                  pageSize: val
                }));
              }}>
              <option>-</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
