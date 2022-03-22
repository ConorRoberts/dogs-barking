import React, { ForwardedRef, forwardRef } from "react";
import { styles, overrides } from "./InputStyles";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "blank" | "file";
  error?: boolean;
}

const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${
    props?.error && styles[variant].error
  } ${props?.disabled && "filter brightness-50"}`;

  // Style specifically if it's a file input
  if (props.type === "file") {
    return <input {...props} className={className} ref={ref} />;
  }

  return <input {...props} className={className} ref={ref} />;
});

Input.displayName = "Input";

export default Input;
