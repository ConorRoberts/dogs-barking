import { Button, Input } from "@components/form";
import { AuthState, signIn } from "@redux/auth";
import { RootState } from "@redux/store";
import { Auth } from "aws-amplify";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Page
 * @description Page
 */
const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await Auth.signIn({
        username,
        password,
      });

      dispatch(signIn());

      await router.push("/");
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="mx-auto bg-white sm:p-8 p-4 dark:bg-gray-800 rounded-xl shadow-md max-w-sm w-full">
        <h2 className="text-center font-normal">Sign In</h2>
        <p>
          Don't have an account?{" "}
          <Link href="/auth/sign-up">
            <a className="underline dark:text-blue-400 text-blue-500">Sign up here</a>
          </Link>
        </p>
        <form className="flex flex-col gap-8 mt-12" onSubmit={handleSignIn}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center">
            <Button type="submit">Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
