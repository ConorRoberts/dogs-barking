"use client";

import BottomNavigationLink from "./BottomNavigationLink";
import { Home, Menu, Search } from "../Icons";
// import useSearchModalStore from "~/store/searchModalStore";

interface Props {
  setDrawerOpen: (open: boolean) => void;
}

const BottomNavigation = ({ setDrawerOpen }: Props) => {
  // const { setOpen } = useSearchModalStore(({ setOpen, open }) => ({ setOpen, open }));
  return (
    <div className="md:hidden">
      <div className="fixed -bottom-2 left-0 right-0 dark:border-t shadow-center-md dark:border-gray-600 flex justify-evenly items-center dark:bg-gray-900 bg-white z-30 pb-6">
        <BottomNavigationLink href="/">
          <Home size={25} />
        </BottomNavigationLink>
        {/* <BottomNavigationLink href="/">
          <Search size={25} onClick={() => setOpen(true)} />
        </BottomNavigationLink> */}

        <div className="small-screen-nav-button" onClick={() => setDrawerOpen(true)}>
          <Menu size={25} />
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
