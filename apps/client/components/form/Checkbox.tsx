import { AiOutlineCheck as Check } from "react-icons/ai";
import React, { HTMLAttributes } from "react";

interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
  value: boolean;
}

const Checkbox = (props: CheckboxProps) => {
  const style = "relative cursor-pointer w-5 h-5";
  return (
    <div
      {...props}
      className={props.className ? `${props.className} ${style}` : `${style} bg-white rounded-sm text-black`}>
      <input type="checkbox" className={`rounded-md cursor-pointer appearance-none`} />
      {/* Checkmark */}
      <div
        className={`absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter ${
          props.value ? "opacity-100" : "opacity-0"
        }`}>
        <Check />
      </div>
    </div>
  );
};

export default Checkbox;
