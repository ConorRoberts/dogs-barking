"use client";

import { Menu } from "../Icons";
import DarkModeButton from "./DarkModeButton";
import TopNavigationLink from "./TopNavigationLink";

interface Props {
  setDrawerOpen: (open: boolean) => void;
}

const TopNavigation = ({ setDrawerOpen }: Props) => {
  return (
    <div className="md:flex hidden z-50 justify-start px-6 gap-4 items-center fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 border-b border-gray-200 dark:border-gray-800">
      <div className="cursor-pointer primary-hover" onClick={() => setDrawerOpen(true)}>
        <Menu size={20} />
      </div>
      <TopNavigationLink href="/" text="Home" />
      <span className="ml-auto">
        {" "}
        <DarkModeButton />{" "}
      </span>
    </div>
  );
};

export default TopNavigation;
