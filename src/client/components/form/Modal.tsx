import { CloseIcon } from "@components/Icons";
import React, { ReactNode, useEffect, useRef } from "react";
import Portal from "./Portal";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  width?: number;
  open: boolean;
}

const Modal = ({ children, onClose, width, open }: ModalProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className={`fixed bg-black bg-opacity-40 inset-0 h-screen z-50 flex justify-center items-center overflow-y-auto p-1`}
        onMouseDown={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}
        onTouchEnd={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}>
        <div
          className={`bg-white dark:bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-[6px] max-w-full rounded-xl p-4 sm:p-6 absolute top-2 mx-auto`}
          ref={ref}
          style={{
            width: width ? `${width}px` : "auto",
          }}>
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
