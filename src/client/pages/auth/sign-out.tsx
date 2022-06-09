import LoadingScreen from "@components/LoadingScreen";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signOut } from "@redux/auth";
import { useDispatch } from "react-redux";
import useRestrictedAuth from "@hooks/useRestrictedAuth";
import MetaData from "@components/MetaData";

/**
 * Page
 * @description Page
 */
const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useRestrictedAuth();

  useEffect(() => {
    dispatch(signOut());
  }, [dispatch]);

  useEffect(() => {
    if (user) return;
    (async () => {
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
