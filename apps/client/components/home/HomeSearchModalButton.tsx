"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchIcon } from "../Icons";
import SearchModal from "../SearchModal";

const HomeSearchModalButton = () => {
  return (
    <>
      <div
        className="bg-white dark:bg-gray-800 rounded-md overflow-hidden px-6 py-2 shadow-center mx-auto w-80 text-lg font-medium flex items-center gap-4 cursor-pointer hover:dark:bg-gray-700 hover:bg-gray-100 transition"
        id="home-search-button"
      >
        <SearchIcon size={25} />
        <p className="text-lg">Search</p>
        <p className="text-lg">gg</p>
        <kbd className="ml-auto opacity-60 text-sm">CTRL + K</kbd>
      </div>
      <SearchModal />
    </>
  );
};

export default HomeSearchModalButton;
