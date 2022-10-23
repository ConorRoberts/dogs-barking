import { Auth } from "aws-amplify";
import axios from "axios";

const configureAxios = () => {
  // Attach the user's access token (JWT) to axios headers if a user is present
  axios.interceptors.request.use(
    async (config) => {
      try {
        const user = await Auth.currentSession();

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
};

export default configureAxios;
