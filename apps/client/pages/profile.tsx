import { Button, CustomErrorMessage, Select } from "@components/form";
import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import School from "@typedefs/School";
import getSchools from "@utils/getSchools";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PageProps {
  schools: School[];
}

const Page = ({ schools }: PageProps) => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.push("/error/403");
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-center">Profile</h1>
        <Formik
          initialValues={{
            school: user?.school ?? "",
            email: user?.email,
            name: user?.name,
            major: user?.major ?? "",
            minor: user?.minor ?? "",
          }}
          onSubmit={async (values) => {
            await axios.post(`/api/user/${user.id}`, values);
          }}>
          {({ values, handleChange, handleSubmit, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <div>
                <div className="form-label-group">
                  <p>School</p>
                  {Boolean(touched.school && errors.school) && (
                    <ErrorMessage name="name" component={CustomErrorMessage} />
                  )}
                </div>
                <Select name="school" value={values.school} onChange={handleChange}>
                  <option value="">None</option>
                  {schools.map((e, index) => (
                    <option key={`school-option-${index}`}>{e.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <div className="form-label-group">
                  <p>Major</p>
                  <ErrorMessage name="name" component={CustomErrorMessage} />
                </div>
                <Select name="major">
                  <option value="">None</option>
                  {majors.map((e, index) => (
                    <option key={`school-option-${index}`}>{e.name}</option>
                  ))}
                </Select>
              </div>
              <Button type="submit">Save</Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const schools = await getSchools();
  return {
    props: {
      schools,
    },
  };
};

export default Page;
