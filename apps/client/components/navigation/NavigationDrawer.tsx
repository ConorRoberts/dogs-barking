import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { Drawer } from "@conorroberts/beluga";
import { SignInIcon, SignOutIcon } from "~/components/Icons";
import { use } from "react";
import amplifyConfig from "~/config/amplify";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const NavigationDrawer = ({ setOpen, open }: Props) => {
  const user = use(
    (async () => {
      try {
        Amplify.configure(amplifyConfig);
        return await Auth.currentAuthenticatedUser();
      } catch (error) {
        return null;
      }
    })()
  );

  console.log(user);

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
        {!user && (
          <div className="nav-drawer-button" onClick={() => signIn()}>
            <SignInIcon size={20} />
            <p>Sign In</p>
          </div>
        )}
        {user && (
          <>
            <div className="nav-drawer-button" onClick={() => Auth.signOut()}>
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
