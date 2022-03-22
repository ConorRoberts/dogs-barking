import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Page
 * @description Page
 */
const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/error/403");
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <div className="mx-auto w-full max-w-3xl"></div>
    </div>
  );
};

export default Page;
