import MetaData from "@components/MetaData";
import Navigation from "@components/Navigation";
import "../styles/globals.css";
import config from "@config/amplify";
import { Amplify } from "aws-amplify";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "@redux/store";
import { useEffect } from "react";
import { AuthState, signIn } from "@redux/auth";
import LoadingScreen from "@components/LoadingScreen";

Amplify.configure(config);

const App = ({ Component, pageProps }) => {
  const { loading, user } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useDispatch();

  const pendingAuth = loading && !user;

  useEffect(() => {
    dispatch(signIn());

    // Refresh login every 1m
    const timer = setInterval(() => {
      dispatch(signIn());
    }, 1 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  return (
    <>
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
        {!pendingAuth && <Navigation />}
        {pendingAuth ? <LoadingScreen /> : <Component {...pageProps} />}
      </div>
    </>
  );
};

const WrappedApp = (props) => {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
};

export default WrappedApp;
