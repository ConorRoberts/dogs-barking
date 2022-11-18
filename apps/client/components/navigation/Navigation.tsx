"use client";

import { useState } from "react";
import SearchModal from "../SearchModal";
import BottomNavigation from "./BottomNavigation";
import NavigationDrawer from "./NavigationDrawer";
import TopNavigation from "./TopNavigation";

const Navigation = () => {
  return (
    <>
      <TopNavigation setDrawerOpen={() => null} />
      <BottomNavigation setDrawerOpen={() => null} />
      {/* <SearchModal /> */}
    </>
  );
};

export default Navigation;
