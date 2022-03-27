import { useEffect, useState } from "react";
import { PlusIcon } from "./Icons";
import { CatalogState, setCatalogType, setPageState, setFilters, resetFilters, setScope } from "@redux/catalog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { Button, Input, Select } from "./form";

const validFilters = [
  { label: "Degree", key: "degree" },
  { label: "School", key: "school" },
  { label: "Department", key: "department" },
  { label: "Prerequisites", key: "prerequisites" },
  { label: "Keywords", key: "keywords" },
  { label: "Course Code", key: "id" },
  { label: "Course Number", key: "number" },
  { label: "Course Name", key: "name" },
];

const CatalogFilter = ({ handleSubmit }) => {
  const { pageState, type, filters, scope } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const [filterKey, setFilterKey] = useState("number");
  const [filterValue, setFilterValue] = useState("");
  const dispatch = useDispatch();

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  useEffect(() => {
    clearFilters();
  }, [type]);

  return (
    <form className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={type === "courses" ? "default" : "outline"}
          onClick={() => dispatch(setCatalogType("courses"))}>
          Courses
        </Button>
        <Button
          variant={type === "programs" ? "default" : "outline"}
          onClick={() => dispatch(setCatalogType("programs"))}>
          Programs
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="mb-1">Sort Key</p>
          <Select onChange={(e) => dispatch(setPageState({ sortKey: e.target.value }))} value={pageState.sortKey}>
            {validFilters.map(({ key, label }) => (
              <option value={key} key={`sort-key-${key}`}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-1">Sort Direction</p>
          <Select onChange={(e) => dispatch(setPageState({ sortDir: e.target.value }))} value={pageState.sortDir}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
        <div>
          <p className="mb-1">Items Per Page</p>
          <Select onChange={(e) => dispatch(setPageState({ pageSize: e.target.value }))} value={pageState.pageSize}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["all", "grad", "undergrad"].map((e) => (
          <Button onClick={() => dispatch(setScope(e))} variant={scope === e ? "default" : "outline"} key={e}>
            <p className="capitalize">{e}</p>
          </Button>
        ))}
      </div>
      <div>
        <h4 className="text-center">Filters</h4>
        <div className="flex gap-4 flex-col">
          <div>
            <p>Filter key</p>
            <Select value={filterKey} onChange={(e) => setFilterKey(e.target.value)}>
              {validFilters.map(({ key, label }) => (
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
      <div>
        <h4 className="text-center">Applied Filters</h4>
        <div className="divide-y divide-gray-300 dark:divide-gray-800">
          {Object.entries(filters).map(([key, value]) => (
            <div className="grid grid-cols-2 gap-4 capitalize py-2">
              <p>{validFilters.find((e) => e.key === key).label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 my-2">
        <Button onClick={handleSubmit} type="submit">
          Submit
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear
        </Button>
      </div>
    </form>
  );
};

export default CatalogFilter;
