import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Redirects a user to the sign in page if they are not authenticated
 * @returns The current state of auth
 */
const useRestrictedAuth = () => {
  const { loading, user } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in");
    }
  }, []);

  return { user, loading };
};

export default useRestrictedAuth;
