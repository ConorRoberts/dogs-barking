import Navigation from "@components/Navigation";
import "../styles/globals.css";
import config from "@config/amplify";
import { Amplify } from "aws-amplify";
import GlobalStateManager from "@components/GlobalStateManager";
import { Provider } from "react-redux";
import store from "@redux/store";

Amplify.configure(config);

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <div
        className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative flex flex-col"
        id="app"
      >
        <Navigation />
        <GlobalStateManager />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
};

export default App;
