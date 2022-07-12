import "../styles/globals.css";
import Navigation from "@components/Navigation";
import config from "@config/amplify";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
import store from "@redux/store";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(config);

const App = ({ Component, pageProps }) => {
  return (
    <Authenticator.Provider>
      <Provider store={store}>
        <div
          className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen md:pt-24 pb-24 md:pb-0 relative flex flex-col"
          id="app"
        >
          <Navigation />
          <Component {...pageProps} />
        </div>
      </Provider> 
    </Authenticator.Provider>
  );
};

export default App;
