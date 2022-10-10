import type { MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import styles from "./styles/index.css";
import belugaStyles from "@conorroberts/beluga/dist/styles.css";
import { APP_NAME } from "~/config/config";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify, Auth } from "aws-amplify";
import config from "./config/amplify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryClientConfig from "./config/queryClientConfig";
import Navigation from "./components/Navigation";
import axios from "axios";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: belugaStyles },
    { rel: "icon", href: "/icons/icon-16x16.png", type: "image/png", sizes: "16x16" },
    { rel: "icon", href: "/icons/icon-32x32.png", type: "image/png", sizes: "32x32" },
    { rel: "apple-touch-icon", href: "/icons/icon-180x180.png" },
    { rel: "manifest", href: "/manifest.json" },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
  "og:title": APP_NAME,
  "og:description": "Find your favourite courses and provide feedback!",
});

Amplify.configure(config);

// Attach the user's access token (JWT) to axios headers if a user is present
axios.interceptors.request.use(
  async (config) => {
    try {
      const user = await Auth.currentSession();

      if (!config.headers) {
        return config;
      }

      config.headers.Authorization = `Bearer ${user.getAccessToken().getJwtToken()}`;

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient(queryClientConfig);

const App = () => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative">
        <Authenticator.Provider>
          <QueryClientProvider client={queryClient}>
            <header>
              <Navigation />
            </header>
            <main>
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </main>
          </QueryClientProvider>
        </Authenticator.Provider>
      </body>
    </html>
  );
};
export default App;

