import MetaData from "@components/MetaData";
import Navigation from "@components/Navigation";
import GlobalStateManager from "@components/GlobalStateManager";
import "../styles/globals.css";
import config from "@config/amplify";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
import store from "@redux/store";
import { QueryClient, QueryClientProvider } from "react-query";

Amplify.configure(config);

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MetaData title="Home">
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <link rel="manifest" href="/manifest.json" />
          <link href="/icons/icon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
          <link href="/icons/icon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/icons/icon-180x180.png"></link>
        </MetaData>
        <div
          className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative flex flex-col"
          id="app">
          <GlobalStateManager />
          <Navigation />
          <Component {...pageProps} />
        </div>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
