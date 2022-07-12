import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Drawer } from "@components/form";
import {
  Home,
  Menu,
  Sun,
  Moon,
  PersonIcon,
  Login,
  Logout,
  // PlannerIcon,
  CatalogIcon,
  SearchIcon,
  AboutIcon,
} from "@components/Icons";
import { useRouter } from "next/router";
import useDarkMode from "@hooks/useDarkMode";
import { useDispatch } from "react-redux";
import SearchModal from "./SearchModal";
import { setOpen } from "@redux/search";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  return (
    <div>
      {menuOpen && (
        <Drawer onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col h-full">
            {/* {user && (
              <Link href="/planner" passHref>
                <div className="nav-drawer-button md:hidden">
                  <PlannerIcon size={20} />
                  <p>Degree Planner</p>
                </div>
              </Link>
            )} */}
            <Link href="/catalog" passHref>
              <div className="nav-drawer-button md:hidden">
                <CatalogIcon size={20} />
                <p>Catalog</p>
              </div>
            </Link>
            <Link href="/about" passHref>
              <div className="nav-drawer-button md:hidden">
                <AboutIcon size={20} />
                <p>About</p>
              </div>
            </Link>
            <Link href="/feedback" passHref>
              <p>Feedback/Contact</p>
            </Link>
            <div className="mt-auto">
              {user && (
                <div
                  className="nav-drawer-button"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <Logout size={20} />
                  <p>Sign Out</p>
                </div>
              )}
              {darkMode ? (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Sun size={20} />
                  <p>Light Mode</p>
                </div>
              ) : (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Moon size={20} />
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
            <a className="small-screen-nav-button">
              <Home size={25} />
            </a>
          </Link>
          <div className="small-screen-nav-button">
            <SearchIcon size={25} onClick={() => dispatch(setOpen(true))} />
          </div>
          {user ? (
            <Link href="/profile" passHref>
              <a className="small-screen-nav-button">
                <PersonIcon size={25} />
              </a>
            </Link>
          ) : (
            <Link href="/auth/sign-in" passHref>
              <a className="small-screen-nav-button">
                <Login size={25} />
              </a>
            </Link>
          )}
          <div className="small-screen-nav-button" onClick={() => setMenuOpen(true)}>
            <Menu size={25} />
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="hidden md:flex z-30 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 py-6 bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
        <div className="cursor-pointer primary-hover" onClick={() => setMenuOpen(true)}>
          <Menu size={20} />
        </div>
        <Link href="/" passHref>
          <a className="big-screen-nav-button">Home</a>
        </Link>
        {/* {user && (
          <Link href="planner" passHref>
            <a className="big-screen-nav-button">Degree Planner</a>
          </Link>
        )} */}
        <Link href="/catalog" passHref>
          <a className="big-screen-nav-button">Catalog</a>
        </Link>
        <Link href="/about" passHref>
          <a className="big-screen-nav-button">About</a>
        </Link>
        <Link href="/feedback" passHref>
          <a className="big-screen-nav-button">Feedback</a>
        </Link>
        <SearchIcon size={25} className="primary-hover ml-auto" onClick={() => dispatch(setOpen(true))} />
        {user ? (
          <Link href="/profile" passHref>
            <a className="big-screen-nav-button ">Profile</a>
          </Link>
        ) : (
          <div onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>
            <p className="big-screen-nav-button ">Sign In</p>
          </div>
        )}
      </div>

      <SearchModal />
    </div>
  );
};

export default Navigation;
