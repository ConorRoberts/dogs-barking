import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { Drawer } from "@conorroberts/beluga";
import { Moon, SignInIcon, SignOutIcon, Sun } from "~/components/Icons";
import useDarkMode from "~/hooks/useDarkMode";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const NavigationDrawer = ({ setOpen, open }: Props) => {
  const { user, signOut } = useAuthenticator();
  const [darkMode, setDarkMode] = useDarkMode();

  const signIn = async () => {
    await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
    await Auth.currentSession();
  };

  return (
    <Drawer onOpenChange={() => setOpen(false)} open={open}>
      <div className="flex flex-col h-full">
        {/* <div className="relative w-[calc(250px/1.5)] h-[calc(75px/1.5)] mx-auto">
          <Image src="/images/text-logo.svg" layout="fill" objectFit="contain" alt="Logo" priority loading="eager" />
        </div> */}
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
        {!user && (
          <div className="nav-drawer-button" onClick={() => signIn()}>
            <SignInIcon size={20} />
            <p>Sign In</p>
          </div>
        )}
        {user && (
          <>
            <div className="nav-drawer-button" onClick={() => signOut()}>
              <SignOutIcon size={20} />
              <p>Sign Out</p>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
