import { CloseIcon } from "@components/Icons";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import Portal from "./Portal";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  open: boolean;
}

const Modal = ({ children, onClose, className, open }: ModalProps) => {
  const ref = useRef(null);

  const handleEscapeKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, handleEscapeKey]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className={`fixed bg-black bg-opacity-40 inset-0 h-screen z-50 flex justify-center items-center overflow-y-auto p-1 `}
        onMouseDown={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}
        onTouchEnd={(e) => ref?.current && !ref?.current.contains(e?.target) && onClose()}
      >
        <div
          className={`bg-gray-100 dark:bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-[6px] ${
            className ?? "max-w-xl"
          } rounded-xl p-4 sm:p-6 absolute top-2 mx-auto w-full`}
          ref={ref}
        >
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
