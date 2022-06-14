import LoadingScreen from "@components/LoadingScreen";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthState, signOut } from "@redux/auth";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "@components/MetaData";
import { RootState } from "@redux/store";

/**
 * Page
 * @description Page
 */
const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  useEffect(() => {
    dispatch(signOut());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (user) return;
      await router.push("/");
    })();
  }, [user, router]);

  return (
    <>
      <MetaData title="Sign Out" />
      <LoadingScreen />
    </>
  );
};

export default Page;
