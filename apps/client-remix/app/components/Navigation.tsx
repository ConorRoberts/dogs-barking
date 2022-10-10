import { useEffect, useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Drawer } from "@conorroberts/beluga";
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
  FeedbackIcon,
} from "~/components/Icons";
// import useDarkMode from "~/hooks/useDarkMode";
// import SearchModal from "./SearchModal";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [darkMode, setDarkMode] = useDarkMode();
  const location = useLocation();
  const { user, signOut } = useAuthenticator();

  // useEffect(() => {
  //   setMenuOpen(false);
  // }, [location.pathname]);

  return (
    <div>
      <Drawer onOpenChange={setMenuOpen} open={menuOpen}>
        <div className="flex flex-col h-full">
          <Link to="/catalog">
            <div className="nav-drawer-button md:hidden">
              <CatalogIcon size={20} />
              <p>Catalog</p>
            </div>
          </Link>
          <div className="mt-auto">
            {user && (
              <div className="nav-drawer-button" onClick={() => signOut()}>
                <Logout size={20} />
                <p>Sign Out</p>
              </div>
            )}
            {/* {darkMode ? (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Sun size={20} />
                  <p>Light Mode</p>
                </div>
              ) : (
                <div className="nav-drawer-button" onClick={() => setDarkMode(!darkMode)}>
                  <Moon size={20} />
                  <p>Dark Mode</p>
                </div>
              )} */}
          </div>
        </div>
      </Drawer>

      {/* Bottom Navigation */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 dark:border-t shadow-center-md dark:border-gray-600 flex justify-evenly items-center dark:bg-gray-900 bg-white z-30 pb-4">
          <Link to="/">
            <a className="small-screen-nav-button">
              <Home size={25} />
            </a>
          </Link>
          {/* <div className="small-screen-nav-button">
            <SearchIcon size={25} onClick={() => dispatch(setOpen(true))} />
          </div> */}
          {user ? (
            <Link to="/profile">
              <a className="small-screen-nav-button">
                <PersonIcon size={25} />
              </a>
            </Link>
          ) : (
            <Link to="/auth/sign-in">
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
      <div className="md:flex z-30 justify-start px-6 gap-6 items-center fixed top-0 left-0 right-0 py-6 bg-white backdrop-opacity-[55%] backdrop-filter backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90 rounded-xl">
        <div className="cursor-pointer primary-hover" onClick={() => setMenuOpen(true)}>
          <Menu size={20} />
        </div>
        <Link to="/">
          <a className="big-screen-nav-button">Home</a>
        </Link>
        {/* {user && (
          <Link to="planner">
            <a className="big-screen-nav-button">Degree Planner</a>
          </Link>
        )} */}
        <Link to="/catalog">
          <a className="big-screen-nav-button">Catalog</a>
        </Link>
        <Link to="/about">
          <a className="big-screen-nav-button">About</a>
        </Link>
        <Link to="/feedback">
          <a className="big-screen-nav-button">Feedback</a>
        </Link>
        {/* <SearchIcon size={25} className="primary-hover ml-auto" onClick={() => dispatch(setOpen(true))} /> */}
        {user ? (
          <Link to="/profile">
            <a className="big-screen-nav-button ">Profile</a>
          </Link>
        ) : (
          <div onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>
            <p className="big-screen-nav-button ">Sign In</p>
          </div>
        )}
      </div>

      {/* <SearchModal /> */}
    </div>
  );
};

export default Navigation;
