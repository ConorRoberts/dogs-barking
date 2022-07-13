import { ErrorMessageProps } from "formik";
import { ReactNode } from "react";

/**
 * Custom error component that is typically placed adjacent to the form field label.
 * @param param0
 * @returns
 */
const CustomErrorMessage = ({ children, ...props }: ErrorMessageProps & { children: ReactNode }) => (
  <p className="text-red-500 text-sm" {...props}>
    {children}
  </p>
);

export default CustomErrorMessage;
