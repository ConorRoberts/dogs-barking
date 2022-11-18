import "@conorroberts/beluga/dist/styles.css";
import "../styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";
import amplifyConfig from "~/config/amplify";
import { Router } from "next/router";
import NavigationDrawer from "~/components/navigation/NavigationDrawer";
import TopNavigation from "~/components/navigation/TopNavigation";
import BottomNavigation from "~/components/navigation/BottomNavigation";
import { Authenticator } from "@aws-amplify/ui-react";
import LoadingScreen from "~/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryClientConfig from "~/config/queryClientConfig";
import SearchModal from "~/components/SearchModal";
import useSearchModalStore from "~/store/searchModalStore";
import configureAxios from "~/utils/configureAxios";

// Attach the user's access token (JWT) to axios headers if a user is present
configureAxios();

Amplify.configure(amplifyConfig);
const queryClient = new QueryClient(queryClientConfig);

const App = ({ Component, pageProps }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setOpen: setSearchModalOpen } = useSearchModalStore(({ setOpen }) => ({ setOpen }));

  useEffect(() => {
    // This is used to display a loading screen in transition
    // Helps for when we're fetching data from the server so the user has feedback in the meantime
    Router.events.on("routeChangeStart", () => {
      setDrawerOpen(false);
      setLoading(true);
      setSearchModalOpen(false);
    });
    Router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });
  }, [setSearchModalOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <Authenticator.Provider>
        <div className="flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-[70px] pb-24 md:pb-2 relative px-2 pt-2">
          <TopNavigation setDrawerOpen={setDrawerOpen} />
          {loading ? <LoadingScreen /> : <Component {...pageProps} />}
          {drawerOpen && <NavigationDrawer setOpen={setDrawerOpen} open={drawerOpen} />}
          <BottomNavigation setDrawerOpen={setDrawerOpen} />
          <SearchModal />
        </div>
      </Authenticator.Provider>
    </QueryClientProvider>
  );
};

export default App;
