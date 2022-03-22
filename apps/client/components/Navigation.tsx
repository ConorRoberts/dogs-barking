import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Drawer } from "@components/form";
import { Home, Menu, Sun, Moon, PersonIcon } from "@components/Icons";
import { useRouter } from "next/router";
import useDarkMode from "@hooks/useDarkMode";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { AuthState } from "@redux/auth";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const router = useRouter();

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  return (
    <div>
      {menuOpen && (
        <Drawer onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col h-full">
            <Link href="/contact" passHref>
              <div className="nav-drawer-button">Meet the Team</div>
            </Link>
            <Link href="/docs" passHref>
              <div className="nav-drawer-button">Docs</div>
            </Link>
            <div className="mt-auto">
              {user && (
                <Link href="/auth/sign-out" passHref>
                  <div className="nav-drawer-button">Sign Out</div>
                </Link>
              )}
              {darkMode ? (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Sun className="w-6 h-6" />
                  <p>Light Mode</p>
                </div>
              ) : (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Moon className="w-6 h-6" />
                  <p>Dark Mode</p>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 dark:border-t shadow-center-md dark:border-gray-600 flex justify-evenly items-center dark:bg-gray-900 bg-white z-30 pb-4">
          <Link href="/" passHref>
            <div className="small-screen-nav-button">
              <Home className="small-screen-nav-button-icon" />
            </div>
          </Link>
          {user && (
            <Link href="/profile" passHref>
              <div className="small-screen-nav-button">
                <PersonIcon className="small-screen-nav-button-icon" />
              </div>
            </Link>
          )}
          <div className="small-screen-nav-button">
            <Menu className="small-screen-nav-button-icon" onClick={() => setMenuOpen(true)} />
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="hidden md:flex z-30 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 py-6 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
        <Menu className="w-6 h-6 cursor-pointer primary-hover" onClick={() => setMenuOpen(true)} />
        <Link href="/" passHref>
          <div className="big-screen-nav-button">
            <p>Home</p>
          </div>
        </Link>
        <Link href="/planner" passHref>
          <div className="big-screen-nav-button">Degree Planner</div>
        </Link>
        <Link href="/catalog" passHref>
          <div className="big-screen-nav-button">Catalog</div>
        </Link>

        {user ? (
          <Link href="/profile" passHref>
            <div className="big-screen-nav-button ml-auto">Profile</div>
          </Link>
        ) : (
          <Link href="/auth/sign-in" passHref>
            <div className="big-screen-nav-button ml-auto">Sign In</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navigation;
