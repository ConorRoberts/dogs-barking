import React from "react";

const SearchRadio = (props) => {
  const { setState, title, options } = props;
  return (
    <div onChange={(setState.bind(this))}>
      <label htmlFor={`radio_${title}`}>{title}</label>
      {options.map((option) => {
        <input id={`radio_${title}`} type="radio" value={option} name={option} />;
      })}
    </div>
  );
};

export default SearchRadio;
