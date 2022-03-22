import { Button, Input } from "@components/form";
import { Loading } from "@components/Icons";
import { signIn } from "@redux/auth";
import { Auth } from "aws-amplify";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

enum AuthStage {
  SignUp,
  ConfirmSignUp,
  SignedIn,
}

/**
 * Page
 * @description Page
 */
const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authStage, setAuthStage] = useState(AuthStage.SignUp);
  const [confirmCode, setConfirmCode] = useState("");
  const [birthdate, setBirthday] = useState("");
  const [name, setName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({ password: "" });

  const dispatch = useDispatch();
  const router = useRouter();

  const signUp = async () => {
    setSubmitLoading(true);
    try {
      if (password !== confirmPassword) throw new Error("Passwords do not match");
      if (email.length < 6) throw new Error("Email must be at least 6 characters");
      if (password.length < 6) throw new Error("Password too short");

      await Auth.signUp({
        username: email,
        password,
        attributes: {
          birthdate: new Date(birthdate).toISOString().slice(0, 10),
          name,
        },
      });

      setAuthStage(AuthStage.ConfirmSignUp);
    } catch (error) {
      console.log("error signing up:", error);
    }
    setSubmitLoading(false);
  };

  const confirmSignUp = async () => {
    setSubmitLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmCode);
      const user = await Auth.signIn(email, password);

      await axios.post("/api/auth/sign-up", { email, birthdate, name, sub: user.attributes.sub });

      dispatch(signIn());
      setAuthStage(AuthStage.SignedIn);
      setTimeout(async () => {
        await router.push("/");
      }, 1000);
    } catch (error) {
      console.log("error confirming sign up:", error);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    if (password.length > 0 && password !== confirmPassword)
      setErrors({ ...errors, password: "Passwords do not match." });
  }, [password, confirmPassword]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="mx-auto bg-white sm:p-8 p-4 dark:bg-gray-800 rounded-xl shadow-md max-w-sm w-full">
        {authStage === AuthStage.SignUp && (
          <>
            <h2 className="text-center font-normal">Sign Up</h2>
            <div className="flex flex-col gap-4 mt-12">
              <div>
                <p className="mb-2">Name</p>
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <p className="mb-2">Email</p>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <p className="mb-2">Password</p>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2">Confirm Password</p>
                <Input
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2">Birthday</p>
                <Input type="date" onChange={(e) => setBirthday(e.target.value)} value={birthdate} />
              </div>
              <div className="flex justify-center">
                <Button onClick={() => signUp()}>Sign Up</Button>
              </div>
              {submitLoading && <Loading className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-700 mx-auto" />}
            </div>
          </>
        )}
        {authStage === AuthStage.ConfirmSignUp && (
          <>
            <h2 className="text-center font-normal">Confirm Sign Up</h2>
            <div className="flex flex-col gap-8 mt-12">
              <Input
                placeholder="Confirmation Code"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
              />

              <div className="flex justify-center">
                <Button onClick={() => confirmSignUp()}>Confirm</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
