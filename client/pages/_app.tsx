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
        <Navigation />
        <Component {...pageProps} />
      </Provider>
    </Authenticator.Provider>
  );
};

export default App;
