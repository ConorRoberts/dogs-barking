import MetaData from "@components/MetaData";
import Catalog from "@components/Catalog";
import { useState } from "react";
import SearchField from "@components/SearchField";
import FilterOptions from "@components/FilterOptions";

const Page = () => {
  const [dataType, setDataType] = useState("courses");
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
      <MetaData title="Catalog" />
      <div className="text-center">
        <h1>Catalog</h1>
      </div>
      <div className="rounded grid grid-cols-2 text-center text-lg divide-x-2 divide-slate-500 border-2 border-solid border-slate-500">
        <button className="hover:bg-sky-200 dark:hover:bg-gray-500 p-2" onClick={() => setDataType("courses")}>Courses</button>
        <button className="hover:bg-sky-200 dark:hover:bg-gray-500 p-2" onClick={() => setDataType("programs")}>Programs</button>
      </div>
      <div>
        <input
          type="text"
          className="rounded p-2 border-solid border-2 border-slate-500 w-1/3 dark:bg-inherit"
          placeholder="Enter Search Term.."
          name="search"
          value={searchText}
          onChange={(elem) => setSearchText(elem.target.value)}
        />
      </div>
      <Catalog type={dataType} query={searchText} />
    </div>
  );
};

export default Page;
