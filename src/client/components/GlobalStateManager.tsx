import { signIn } from "@redux/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * Manages global state that other components are dependent on.
 */
const GlobalStateManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signIn());

    // Refresh login every 1m
    const timer = setInterval(() => {
      dispatch(signIn());
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  return null;
};

export default GlobalStateManager;
