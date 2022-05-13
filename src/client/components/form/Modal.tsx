import { CloseIcon } from "@components/Icons";
import React, { ReactNode, useEffect, useRef } from "react";
import Portal from "./Portal";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <Portal>
      <div
        className={`fixed bg-black bg-opacity-40 inset-0 h-screen z-50 flex justify-center items-center overflow-y-auto p-1 min-w-sm
    }`}
        onMouseDown={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}
        onTouchEnd={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}>
        <div
          className={`bg-white dark:bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-[6px] w-screen max-w-max rounded-xl p-4 sm:p-6 absolute top-2 mx-auto`}
          ref={ref}>
          <CloseIcon
            className="ml-auto w-6 h-6 transition cursor-pointer primary-hover mb-2"
            onClick={() => onClose()}
          />
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
