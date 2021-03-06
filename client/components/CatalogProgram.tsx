import Link from "next/link";
import { useState } from "react";
import { DropdownIcon } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./form";
import Program from "@typedefs/Program";

interface Props {
  program: Program;
}
const CatalogProgram = ({ program }: Props) => {
  const { id, degree } = program;

  const [open, setOpen] = useState(false);

  return (
    <div className="dark:even:bg-gray-800">
      <div
        className="flex items-center cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-300 transition-colors"
        onClick={() => setOpen(!open)}>
        <motion.div
          animate={{ rotate: open ? "0deg" : "-90deg" }}
          transition={{ duration: 0.1 }}
          onClick={() => setOpen(!open)}>
          <DropdownIcon size={40} />
        </motion.div>
        <p className="font-semibold flex-1 p-2">
          {degree} - {program.short} - {program.name}
        </p>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, overflow: "hidden", padding: "0px" }}
            animate={{ height: "auto", overflow: "visible", padding: "8px" }}
            exit={{ height: 0, overflow: "hidden", padding: "0px" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4">
            <p>{program.name}</p>

            <div className="mx-auto">
              <Link href={`/program/${id}`} passHref>
                <a>
                  <Button variant="outline">View More</Button>
                </a>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogProgram;
