import { setUser, signIn } from "@redux/auth";
import getToken from "@utils/getToken";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * Manages global redux state across the app
 */
const GlobalStateManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signIn());

    // Refresh token every 1m
    const timer = setInterval(async () => {
      dispatch(setUser({ token: await getToken() }));
    }, 1 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  return null;
};

export default GlobalStateManager;
