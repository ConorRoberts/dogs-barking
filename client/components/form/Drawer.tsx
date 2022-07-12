import React, { MouseEvent, ReactNode, TouchEvent, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Portal from "./Portal";

export interface DrawerProps {
  children: ReactNode;
  onClose: () => void;
}

interface ResponsiveDrawerProps extends DrawerProps {
  position: "left" | "right";
}

const Drawer = (props: DrawerProps) => {
  return (
    <Portal>
      <ResponsiveDrawer position="right" {...props} />
      <ResponsiveDrawer position="left" {...props} />
    </Portal>
  );
};

const ResponsiveDrawer = ({ children, onClose, position }: ResponsiveDrawerProps) => {
  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleEvent = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (ref?.current && !ref?.current?.contains(e.target)) {
      onClose();
    }
  };

  return (
    <Portal>
      <div
        className={`fixed bg-black bg-opacity-50 left-0 inset-0 right-0 h-screen z-50 backdrop-filter backdrop-blur-sm flex justify-end md:justify-start ${
          position === "left" ? "md:block hidden" : "md:hidden"
        }`}
        onMouseDown={handleEvent}
        onTouchEnd={handleEvent}
      >
        <motion.div
          className={` bg-white dark:bg-gray-900 w-max h-screen px-2 py-8`}
          animate={{ translateX: position === "left" ? "0%" : "0%" }}
          initial={{ translateX: position === "left" ? "-100%" : "100%" }}
          exit={{ translateX: position === "left" ? "-100%" : "100%" }}
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 500,
          }}
          ref={ref}
        >
          {children}
        </motion.div>
      </div>
    </Portal>
  );
};

export default Drawer;
