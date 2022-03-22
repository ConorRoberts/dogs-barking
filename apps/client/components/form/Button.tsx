import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "blank" | "filled" | "gray";
    error?: boolean;
}

const overrides = `focus:ring-0 focus:outline-none appearance-none`;

const styles: any = {
  default: {
    style: "text-white bg-blue-500 rounded-full py-1 px-6 hover:bg-blue-400 transition",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50"
  },
  gray: {
    style: "text-white bg-gray-800 rounded-md py-1.5 px-6 hover:bg-gray-700 transition",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50"
  },
  blank: {
    style: "",
    error: "",
  },
};

export default function Button(props: ButtonProps) {

  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${props?.error && styles[variant].error} ${props?.disabled && styles[variant].disabled}`;
  return (
    <button
      {...props}
      className={className}
      type={props.type ?? "button"}
    >
      {props.children}
    </button>
  );
}