import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "blank" | "outline";
  error?: boolean;
}

const overrides = `focus:ring-0 focus:outline-none appearance-none`;

const styles = {
  default: {
    style: "text-white bg-blue-500 rounded-md py-1 px-6 hover:bg-blue-400 transition",
    disabled: "filter brightness-50",
  },
  outline: {
    style:
      "rounded-md py-1 px-6 hover:border-gray-400 hover:text-gray-400 dark:hover:opacity-80 dark:text-gray-200 text-gray-500 transition border border-gray-500 dark:border-gray-700",
    disabled: "filter brightness-50",
  },
  blank: {
    style: "",
    disabled: "",
  },
};

const Button = (props: ButtonProps) => {
  const { variant = "default" } = props;

  return (
    <button
      {...props}
      className={`focus:ring-0 focus:outline-none appearance-none rounded-md py-1 px-6 hover:bg-blue-400 transition
    ${props?.disabled ? "filter brightness-50" :""} flex items-center gap-2 justify-center`}
      type={props.type ?? "button"}
    >
      {props.children}
    </button>
  );
};

export default Button;
