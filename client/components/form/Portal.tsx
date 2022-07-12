import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

/**
 * Renders children components outside of the parent component.
 * @param children Children components to render.
 */
const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? ReactDOM.createPortal(children, document.getElementById("app")) : null;
};

export default Portal;
