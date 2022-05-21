import { CheckIcon, ErrorIcon } from "@components/Icons";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";

interface Props {
  open: boolean;
  type?: "success" | "failure";
  text: string;
}

const Toast = ({ open, type, text }: Props) => {
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ translateX: "150%", opacity: 0 }}
            animate={{ translateX: "0%", opacity: 1 }}
            exit={{ translateX: "150%", opacity: 0 }}
            className={`text-white ${type === "success" && "bg-emerald-700"} ${
              type === "failure" && "bg-rose-700"
            } border border-green-100 dark:border-green-800 rounded-md p-2 flex items-center gap-2 fixed bottom-20 md:bottom-2 right-2`}>
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
