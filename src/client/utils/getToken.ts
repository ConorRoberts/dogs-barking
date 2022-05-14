import { Auth } from "aws-amplify";

const getToken = async () => {
  return (await Auth.currentSession()).getIdToken().getJwtToken();
};

export default getToken;
