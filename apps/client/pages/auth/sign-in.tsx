import { Button, CustomErrorMessage, Input } from "@components/form";
import { AuthState, signIn } from "@redux/auth";
import { RootState } from "@redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingIcon } from "@components/Icons";
import { Auth } from "aws-amplify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

/**
 * @description Sign in page. Contains a basic form for signing in.
 */
const Page = () => {
  const [signInError, setSignInError] = useState("");
  const router = useRouter();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // If there exists a user in the redux store, redirect to the home page
    // We don't want people who are logged in to be using this page
    if (user) router.push("/");
  }, [user, router]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="mx-auto bg-white sm:p-8 p-4 dark:bg-gray-800 rounded-xl shadow-md max-w-sm w-full">
        <h2 className="text-center font-normal">Sign In</h2>
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up">
            <a className="underline dark:text-blue-400 text-blue-500">Sign up here</a>
          </Link>
        </p>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async ({ email, password }) => {
            try {
              // Authenticate with AWS
              await Auth.signIn({
                username: email,
                password,
              });

              // Set the user in the redux store
              dispatch(signIn());

              // Redirect to the home page
              await router.push("/");
            } catch (error) {
              setSignInError("Invalid username or password");
            }
          }}
          validationSchema={Yup.object({
            email: Yup.string().required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}>
          {({ isSubmitting }) => (
            <Form>
              <div className="flex flex-col gap-4 mt-6">
                <div>
                  <div className="form-label-group">
                    <p>Email</p>
                    <ErrorMessage name="email" component={CustomErrorMessage} />
                  </div>
                  <Field placeholder="Email" component={Input} name="email" type="email" />
                </div>
                <div>
                  <div className="form-label-group">
                    <p>Password</p>
                    <ErrorMessage name="password" component={CustomErrorMessage} />
                  </div>
                  <Field placeholder="*******" component={Input} name="password" type="password" />
                </div>
                <div className="flex justify-center">
                  <Button type="submit">
                    Sign In {isSubmitting && <LoadingIcon size={15} className="animate-spin" />}
                  </Button>
                </div>
                {signInError.length > 0 && (
                  <div>
                    <p className="text-center text-sm text-red-500 mt-2">{signInError}</p>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
