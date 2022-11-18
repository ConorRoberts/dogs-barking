"use client";

import useSearch from "~/hooks/useSearch";
import { FC, use, useCallback, useEffect, useState } from "react";
import { Button, Input, Modal } from "@conorroberts/beluga";
import { LoadingIcon } from "./Icons";
import useSearchModalStore from "~/store/searchModalStore";
import SearchModalSearchResult from "./SearchModalSearchResult";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const SearchModal: FC<Props> = ({ open, onOpenChange }) => {
  const router = useRouter();

  const [text, setText] = useState("");
  const [type, setType] = useState<"course" | "program">("course");
  const data = use(useSearch(text, { type }));
  const toggleOpen = () => onOpenChange(!open);

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
          {/* {loading && (
            <div>
              <LoadingIcon size={20} className="animate-spin" />
            </div>
          )} */}
        </div>
        <div className="relative mx-auto max-w-xs w-full grid grid-cols-2 gap-2 text-center">
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
        <div className="dark:bg-gray-800 rounded overflow-hidden">
          {data.map((e) => (
            <SearchModalSearchResult data={e} type={type} key={e.id} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
