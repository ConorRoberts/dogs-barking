import React from "react";
import { Input } from "./form";

/**
 *
 * @param props
 * @returns
 */
const SearchField = (props) => {
  const { setState, title, type, value, className } = props;

  return (
    <div className={className}>
      <Input className="dark:text-black" id={title} type={type} onChange={(e) => setState(e.target.value)} value={value} placeholder={title}/>
    </div>
  );
};

export default SearchField;
