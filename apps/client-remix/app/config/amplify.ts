import { WEBSITE_URL } from "./config";

const config = {
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_0QeQcwaVy",
    userPoolWebClientId: "5a74gnvdtgue7slh2guo59or5j",
    oauth: {
      domain: "auth.dogs-barking.ca",
      scope: ["email", "openid", "profile"],
      redirectSignIn: WEBSITE_URL,
      redirectSignOut: WEBSITE_URL,
      responseType: "code",
    },
  },
};

export default config;
