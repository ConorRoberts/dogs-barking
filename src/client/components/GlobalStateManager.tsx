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
  }, [dispatch]);

  return null;
};

export default GlobalStateManager;
