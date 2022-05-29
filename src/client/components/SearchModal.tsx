import useSearch from "@hooks/useSearch";
import { SearchState, setOpen, setText } from "@redux/search";
import { RootState } from "@redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal } from "./form";
import { LoadingIcon } from "./Icons";

const SearchModal = () => {
  const [searchType, setSearchType] = useState<"course" | "program">("course");
  const { open, text } = useSelector<RootState, SearchState>((state) => state.search);
  const { results, loading } = useSearch(text, { type: searchType });
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const toggleOpen = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dispatch(setOpen(false));
      }

      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        dispatch(setOpen(!open));
        dispatch(setText(""));
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", toggleOpen);

    return () => {
      window.removeEventListener("keydown", toggleOpen);
    };
  }, [open, dispatch]);

  useEffect(() => {
    dispatch(setOpen(false));
  }, [router.asPath, dispatch]);

  return (
    <Modal onClose={() => dispatch(setOpen(false))} width={500} open={open}>
      <div className="relative mx-auto max-w-xl w-full flex flex-col gap-2">
        <div className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-md`}>
          <Input
            onChange={(e) => dispatch(setText(e.target.value))}
            value={text}
            placeholder={searchType === "course" ? "Course code" : "Program code"}
            className={`py-3 text-lg w-full dark:bg-gray-800`}
            variant="blank"
            autoComplete="off"
            ref={inputRef}
          />
          {loading && (
            <div>
              <LoadingIcon size={20} className="animate-spin" />
            </div>
          )}
        </div>
        <div className="relative mx-auto max-w-xs w-full grid grid-cols-2 gap-2">
          <Button onClick={() => setSearchType("course")} variant={searchType === "course" ? "default" : "outline"}>
            Course
          </Button>
          <Button onClick={() => setSearchType("program")} variant={searchType === "program" ? "default" : "outline"}>
            Program
          </Button>
        </div>
        <div className="dark:bg-gray-800">
          {results.map((e) => (
            <Link href={`/${searchType}/${e.id}`} key={e.id} passHref>
              <a
                className="px-4 py-0.5 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16"
                id={`home-course-search-result-${searchType === "course" ? e.code : e.short}`}>
                <p>{searchType === "course" ? e.code : e.short}</p>
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
