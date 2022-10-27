"use client";

import { useState } from "react";
import SearchModal from "../SearchModal";
import BottomNavigation from "./BottomNavigation";
import NavigationDrawer from "./NavigationDrawer";
import TopNavigation from "./TopNavigation";

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <NavigationDrawer setOpen={setDrawerOpen} open={drawerOpen} />
      <TopNavigation setDrawerOpen={setDrawerOpen} />
      <BottomNavigation setDrawerOpen={setDrawerOpen} />
      {/* <SearchModal /> */}
    </>
  );
};

export default Navigation;
