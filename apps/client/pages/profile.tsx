import { Select } from "@components/form";
import LoadingScreen from "@components/LoadingScreen";
import schools from "@config/schools";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { Form, Formik } from "formik";
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
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-center">Profile</h1>
        <Formik initialValues={{
          school: user.school,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }}>
          {({ handleSubmit, isSubmitting }) => (
            <Form>
              <div>
                <p>School</p>
                <Select name="school">
                  {schools.map((e, index) => (
                    <option key={`school-option-${index}`}>{e.name}</option>
                  ))}
                </Select>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
