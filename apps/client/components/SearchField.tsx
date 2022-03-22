import React from "react";
import { Input } from "./form";

/**
 *
 * @param props
 * @returns
 */
const SearchField = (props) => {
  const { setState, title, type, value } = props;

  return (
    <div>
      <label htmlFor={title}>{title}</label>
      <Input className="dark:text-black" id={title} type={type} onChange={(e) => setState(e.target.value)} value={value}/>
    </div>
  );
};

export default SearchField;
