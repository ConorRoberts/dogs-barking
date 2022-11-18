import { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "~/components/Icons";
import { CatalogState, setCatalogType, setPageState, setFilters, resetFilters } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Select } from "@conorroberts/beluga";

const validFilters = {
  courses: [
    { label: "Degree", key: "degree" },
    { label: "School", key: "school" },
    { label: "Department", key: "department" },
    { label: "Prerequisites", key: "prerequisites" },
    { label: "Keywords", key: "keywords" },
    { label: "Course Code", key: "id" },
    { label: "Course Number", key: "number" },
    { label: "Course Name", key: "name" },
  ],
  programs: [
    { label: "Degree", key: "degree" },
    { label: "Name", key: "name" },
    { label: "Program Code", key: "id" },
    { label: "School", key: "school" },
  ],
};

const CatalogFilter = ({ handleSubmit }) => {
  const { pageState, type } = useSelector<CatalogState, CatalogState>((state) => state);
  const [filterKey, setFilterKey] = useState("number");
  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const toggleType = (type: string) => {
    clearFilters();
    dispatch(setPageState({ ...pageState, pageNum: 0 }));
    dispatch(setCatalogType(type));
  };

  useEffect(() => {
    clearFilters();
  }, [type, clearFilters]);

  return (
    <form className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Button variant={type === "courses" ? "text" : "outlined"} onClick={() => toggleType("courses")}>
          Courses
        </Button>
        <Button variant={type === "programs" ? "text" : "outlined"} onClick={() => toggleType("programs")}>
          Programs
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="mb-1">Sort Key</p>
          <Select onValueChange={(sortKey) => dispatch(setPageState({ sortKey }))} value={pageState.sortKey}>
            {validFilters[type].map(({ key, label }) => (
              <option value={key} key={`sort-key-${key}`}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-1">Sort Direction</p>
          <Select onValueChange={(sortDir) => dispatch(setPageState({ sortDir }))} value={pageState.sortDir}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
        <div>
          <p className="mb-1">Items Per Page</p>
          <Select onValueChange={(pageSize) => dispatch(setPageState({ pageSize }))} value={pageState.pageSize}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </Select>
        </div>
      </div>
      {/* <div className="grid grid-cols-3 gap-2">
        {["all", "grad", "undergrad"].map((e) => (
          <Button onClick={() => dispatch(setScope(e))} variant={scope === e ? "default" : "outline"} key={e}>
            <p className="capitalize">{e}</p>
          </Button>
        ))}
      </div> */}
      <div>
        <h4 className="text-center">Filters</h4>
        <div className="flex gap-4 flex-col">
          <div>
            <p>Filter key</p>
            <Select value={filterKey} onValueChange={(value) => setFilterKey(value)}>
              {validFilters[type].map(({ key, label }) => (
                <option value={key} key={`option-${key}`}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <p>Filter value</p>
            <Input onChange={(e) => setFilterValue(e.target.value)} value={filterValue} />
          </div>
          <div className="mx-auto">
            <Button onClick={() => dispatch(setFilters({ [filterKey]: filterValue }))}>
              <PlusIcon size={20} />
              Add Filter
            </Button>
          </div>
        </div>
      </div>
      {/* <div>
        <h4 className="text-center">Applied Filters</h4>
        <div className="divide-y divide-gray-300 dark:divide-gray-800">
          {Object.entries(filters).map(([key, value]) => (
            <div className="grid grid-cols-2 gap-4 capitalize py-2" key={`filter-key-${key}`}>
              <p>{validFilters[type].find((e) => e.key === key).label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div> */}
      <div className="flex justify-center gap-4 my-2">
        <Button onClick={handleSubmit} type="submit">
          Submit
        </Button>
        <Button onClick={clearFilters} variant="outlined">
          Clear
        </Button>
      </div>
    </form>
  );
};

export default CatalogFilter;
