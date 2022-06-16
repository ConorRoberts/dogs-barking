import { CheckIcon, ErrorIcon } from "@components/Icons";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";

interface Props {
  open: boolean;
  type?: "success" | "failure" | "default";
  text: string;
}

const toastColours = {
  success: "bg-emerald-700",
  failure: "bg-rose-700",
  default: "bg-gray-100 dark:bg-gray-700",
};

/**
 * Notification that slides in from the side of the screen.
 * Great for giving the user feedback.
 */
const Toast = ({ open, type = "default", text }: Props) => {
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ translateX: "150%", opacity: 0 }}
            animate={{ translateX: "0%", opacity: 1 }}
            exit={{ translateX: "150%", opacity: 0 }}
            className={`text-white ${toastColours[type]} rounded-md p-2 flex items-center gap-2 fixed bottom-20 md:bottom-2 right-2`}>
            {type === "success" && <CheckIcon size={25} />}
            {type === "failure" && <ErrorIcon size={25} />}
            <p>{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Toast;
