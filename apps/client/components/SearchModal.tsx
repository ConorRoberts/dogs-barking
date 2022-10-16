import useSearch from "~/hooks/useSearch";
import Course from "~/types/Course";
import Program from "~/types/Program";
import Link from "next/link";
import { useEffect } from "react";
import { Button, Input, Modal } from "@conorroberts/beluga";
import { LoadingIcon } from "./Icons";
import useSearchModalStore from "~/store/searchModalStore";

const SearchModal = () => {
  const { open, text, setOpen, setText, toggleOpen, type, setType } = useSearchModalStore((state) => state);
  const { data: results = [], isLoading: loading } = useSearch(text, { type });

  useEffect(() => {
    window.addEventListener("keydown", toggleOpen);

    return () => {
      window.removeEventListener("keydown", toggleOpen);
    };
  }, [toggleOpen]);

  return (
    <Modal onOpenChange={setOpen} open={open} position="top">
      <div className="relative mx-auto max-w-xl w-full flex flex-col gap-2" id="search-modal">
        <div className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-md`}>
          <Input
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder={type === "course" ? "Course code" : "Program code"}
            className={`py-3 text-lg w-full dark:bg-gray-800`}
            variant="blank"
            autoComplete="off"
            autoFocus
          />
          {loading && (
            <div>
              <LoadingIcon size={20} className="animate-spin" />
            </div>
          )}
        </div>
        <div className="relative mx-auto max-w-xs w-full grid grid-cols-2 gap-2">
          <Button
            onClick={() => setType("course")}
            variant={type === "course" ? "filled" : "outlined"}
            color={type === "course" ? "blue" : "gray"}
          >
            Course
          </Button>
          <Button
            onClick={() => setType("program")}
            variant={type === "program" ? "filled" : "outlined"}
            color={type === "program" ? "blue" : "gray"}
          >
            Program
          </Button>
        </div>
        <div className="dark:bg-gray-800">
          {results.map((e) => (
            <Link href={`/${type}/${e.id}`} key={e.id} passHref>
              <a
                className="px-4 py-0.5 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16"
                id={`search-modal-result-${type === "course" ? (e as Course).code : (e as Program).short}`}
              >
                <p>{type === "course" ? (e as Course).code : (e as Program).short}</p>
                <p className="truncate">{e.name}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
