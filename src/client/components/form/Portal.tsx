import { ReactNode } from "react";
import ReactDOM from "react-dom";

/**
 * Renders children components outside of the parent component.
 * @param children Children components to render.
 */
const Portal = ({ children }: { children: ReactNode }) => {
  return ReactDOM.createPortal(children, document.getElementById("app"));
};

export default Portal;
