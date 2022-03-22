import React from "react";

export interface SwitchProps {
  value: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "default" | "light-gray";
  name?: string;
}

const Switch = (props: SwitchProps) => {
  const style = {
    default: {
      style: "bg-dark-gray",
      active: "bg-accent-1",
      button: "bg-white",
    },
    "light-gray": {
      style: "bg-gray-800",
      active: "bg-accent-1",
      button: "bg-white",
    },
  };

  const { variant = "default" } = props;
  return (
    <div
      {...props}
      className={`relative filter w-10 h-5 rounded-xl transition-all ${
        props.value ? style[variant].active : style[variant].style
      } ${props.disabled ? "brightness-50" : "cursor-pointer"} ${props.className}`}
      aria-label="switch"
      onClick={() => !props.disabled && props.onClick && props.onClick()}>
      <div
        className={`absolute transition-all transform top-1/2 z-10 -translate-y-1/2 ${
          !props.disabled && "cursor-pointer"
        } h-4 w-4 rounded-full ${style[variant].button} ${props.value ? "left-5" : "left-1"}`}></div>
    </div>
  );
};

export default Switch;
