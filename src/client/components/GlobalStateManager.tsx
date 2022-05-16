import { setToken, signIn } from "@redux/auth";
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

    (async () => {
      dispatch(setToken(await getToken()));
    })();

    // Refresh token every 5m
    const timer = setInterval(async () => {
      dispatch(setToken(await getToken()));
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  return null;
};

export default GlobalStateManager;
