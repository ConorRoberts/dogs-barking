import Link from "next/link";
import { useState } from "react";
import { ArrowDown as DropdownIcon } from "~/components/Icons";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@conorroberts/beluga";
import School from "~/types/School";

interface Props {
  school: School;
}
const CatalogSchool = ({ school }: Props) => {
  const { id } = school;

  const [open, setOpen] = useState(false);

  return (
    <div className="dark:even:bg-gray-800">
      <div
        className="flex items-center cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-300 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <motion.div
          animate={{ rotate: open ? "0deg" : "-90deg" }}
          transition={{ duration: 0.1 }}
          onClick={() => setOpen(!open)}
        >
          <DropdownIcon size={40} />
        </motion.div>
        <p className="font-semibold flex-1 p-2">
          {school.short} - {school.name}
        </p>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, overflow: "hidden", padding: "0px" }}
            animate={{ height: "auto", overflow: "visible", padding: "8px" }}
            exit={{ height: 0, overflow: "hidden", padding: "0px" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p>{school.country}</p>
            <p>{school.province}</p>
            <p>{school.city}</p>
            <div className="mx-auto">
              <Link href={`/school/${id}`} passHref>
                <Button variant="outlined">View More</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogSchool;
