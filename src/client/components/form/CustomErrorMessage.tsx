import { ErrorMessageProps } from "formik";

/**
 * Custom error component that is typically placed adjacent to the form field label.
 * @param param0
 * @returns
 */
const CustomErrorMessage = ({ children, ...props }: ErrorMessageProps) => (
  <p className="text-red-500 text-sm" {...props}>
    {children}
  </p>
);

export default CustomErrorMessage;
