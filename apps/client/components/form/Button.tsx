import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "blank" | "outline";
  error?: boolean;
}

const overrides = `focus:ring-0 focus:outline-none appearance-none`;

const styles: any = {
  default: {
    style: "text-white bg-blue-500 rounded-full py-1 px-6 hover:bg-blue-400 transition",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50",
  },
  outline: {
    style: "rounded-full py-1 px-6 hover:border-blue-500 dark:hover:border-blue-500 transition border border-gray-300 dark:border-gray-700",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50",
  },
  blank: {
    style: "",
    error: "",
  },
};

const Button = (props: ButtonProps) => {
  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${
    props?.error && styles[variant].error
  } ${props?.disabled && styles[variant].disabled} flex items-center gap-2 justify-center`;
  return (
    <button {...props} className={className} type={props.type ?? "button"}>
      {props.children}
    </button>
  );
};

export default Button;
