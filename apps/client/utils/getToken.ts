import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

const getToken = (user?: UseAuthenticator["user"]) => {
  if (!user) return null;
  return user?.getSignInUserSession().getAccessToken().getJwtToken();
};

export default getToken;
