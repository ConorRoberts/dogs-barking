import { Auth } from "aws-amplify";

const getToken = async () => {
  return (await Auth.currentSession()).getAccessToken().getJwtToken();
};

export default getToken;
