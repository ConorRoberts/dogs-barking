import "@conorroberts/beluga/dist/styles.css";
import "@conorroberts/beluga/dist/preflight.css";
import "~/styles/globals.css";
import { FC, ReactNode } from "react";
import Navigation from "~/components/navigation/Navigation";
import { Amplify } from "aws-amplify";
import amplifyConfig from "~/config/amplify";

interface PageProps {
  children: ReactNode;
}

const RootLayout = async ({ children }) => {
  return (
    <html>
      <head>
        <title>Hello</title>
      </head>
      <body>
        <main className="flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-[70px] pb-24 md:pb-2 relative px-2 pt-2">
          <Navigation />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
