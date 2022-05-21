import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, CustomErrorMessage, Input } from "@components/form";
import { Loading, LoadingIcon } from "@components/Icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SignUpProps from "@typedefs/SignUpProps";
import { useRouter } from "next/router";
import { signIn } from "@redux/auth";
import axios from "axios";
import { useSelector } from "react-redux";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import getToken from "@utils/getToken";

export enum AuthStage {
  SignUp,
  ConfirmSignUp,
  SignedIn,
}

/**
 * Page
 * @description Page
 */
const Page = () => {
  const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.SignUp);
  const [submitError, setSubmitError] = useState("");
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async ({ email, password, name, birthdate, confirmCode }: SignUpProps) => {
    if (authStage === AuthStage.SignUp) {
      try {
        await Auth.signUp({
          username: email,
          password: password,
          attributes: {
            birthdate: new Date(birthdate).toISOString().slice(0, 10),
            name: name,
          },
        });

        setAuthStage(AuthStage.ConfirmSignUp);
      } catch (error) {
        setSubmitError(error.message);
      }
    } else if (authStage === AuthStage.ConfirmSignUp) {
      try {
        await Auth.confirmSignUp(email, confirmCode);
        const user = await Auth.signIn(email, password);

        await axios.post(
          "/api/user",
          {
            email: email,
            birthdate: birthdate,
            name: name,
            sub: user.attributes.sub,
          },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        dispatch(signIn());
        setAuthStage(AuthStage.SignedIn);
        setTimeout(async () => {
          await router.push("/");
        }, 1000);
      } catch (error) {
        console.log("error confirming sign up:", error.message);
      }
    }
  };

  const shape = Yup.object({
    email: Yup.string().email("Email is not a valid email").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Field is required"),
    birthdate: Yup.string().required("Birthday is required"),
    name: Yup.string().required("Name is required"),
  });

  useEffect(() => {
    setSubmitError("");
  }, [authStage]);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="mx-auto bg-white sm:p-8 p-4 dark:bg-gray-800 rounded-xl shadow-md max-w-md w-full">
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            confirmCode: "",
            birthdate: "",
            name: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={shape}>
          {({ isSubmitting }) => (
            <Form>
              {authStage === AuthStage.SignUp && (
                <>
                  <h2 className="text-center font-normal">Sign Up</h2>
                  <div className="flex flex-col gap-4 mt-12">
                    <div>
                      <div className="form-label-group">
                        <p>Name</p>
                        <ErrorMessage name="name" component={CustomErrorMessage} />
                      </div>
                      <Field component={Input} name="name" placeholder="John Doe" />
                    </div>
                    <div>
                      <div className="form-label-group">
                        <p>Email</p>
                        <ErrorMessage name="email" component={CustomErrorMessage} />
                      </div>
                      <Field component={Input} name="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <div className="form-label-group">
                        <p>Password</p>
                        <ErrorMessage name="password" component={CustomErrorMessage} />
                      </div>
                      <Field component={Input} name="password" type="password" placeholder="*********" />
                    </div>
                    <div>
                      <div className="form-label-group items-center">
                        <p>Confirm Password</p>
                        <ErrorMessage name="confirmPassword" component={CustomErrorMessage} />
                      </div>
                      <Field component={Input} name="confirmPassword" type="password" placeholder="*********" />
                    </div>
                    <div>
                      <div className="form-label-group">
                        <p>Birthday</p>
                        <ErrorMessage name="birthdate" component={CustomErrorMessage} />
                      </div>
                      <Field component={Input} name="birthdate" type="date" />
                    </div>
                    <div className="flex justify-center">
                      <Button type="submit">
                        Sign Up {isSubmitting && <LoadingIcon size={15} className="animate-spin" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {authStage === AuthStage.ConfirmSignUp && (
                <>
                  <h2 className="text-center font-normal">Confirm Sign Up</h2>
                  <p className="text-gray-500 text-center">You should receive a confirmation code in your email shortly</p>
                  <div className="flex flex-col gap-8">
                    <Field placeholder="123456" name="confirmCode" component={Input} />

                    <div className="flex justify-center">
                      <Button type="submit">
                        Confirm Code {isSubmitting && <LoadingIcon size={15} className="animate-spin" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {submitError.length > 0 && (
                <div>
                  <p className="text-center text-sm text-red-500 mt-2">{submitError}</p>
                </div>
              )}
            </Form>
          )}
        </Formik>

        {authStage === AuthStage.SignedIn && (
          <>
            <h3 className="text-center">Success</h3>
            <p className="text-center">You are now signed up</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
