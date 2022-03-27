import { AiOutlineDown } from "react-icons/ai";
import SearchField from "./SearchField";
import { useState } from "react";

const FilterOption = (props) => {
  const { setState, value, name, type } = props;
  const filterStyle = "cursor-pointer py-2 hover:bg-sky-200 dark:hover:bg-gray-700 " +
                      "dark:opacity-90 relative";
  const [searchStyle, setSearchStyle] = useState("hidden p-2");

  const toggleSearch = (searchStyle) => {
    if (searchStyle.includes("hidden")) {
      setSearchStyle("block p-2");
    } else {
      setSearchStyle("hidden p-2");
    }
  };
  return (
    <div>
      <li className={filterStyle} onClick={()=> toggleSearch(searchStyle)}>
        <p className="text-left px-2 py-1">{name}</p>
        <AiOutlineDown className="absolute right-2 bottom-4"/>
      </li>
      <SearchField className={searchStyle} title={name} type={type} setState={setState} value={value} />
    </div>
  );
};

export default FilterOption;
