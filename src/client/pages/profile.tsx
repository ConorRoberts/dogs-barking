import { Button, CustomErrorMessage, Select } from "@components/form";
import { CheckIcon, LoadingIcon } from "@components/Icons";
import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import School from "@typedefs/School";
import getSchools from "@utils/getSchools";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

interface PageProps {
  schools: School[];
}

type UpdateStatus = "" | "success" | "failure";

const Page = ({ schools }: PageProps) => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/error/403");
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl p-2">
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
            let status: UpdateStatus = "success";
            
            try {
              await axios.post(`/api/user/${user.id}`, values);
            } catch (error) {
              status = "failure";
            }

            setUpdateStatus(status);
            setTimeout(() => {
              setUpdateStatus("");
            }, 2500);
          }}>
          {({ values, handleChange, handleSubmit, touched, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto max-w-md">
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
                  <ErrorMessage name="major" component={CustomErrorMessage} />
                </div>
                <Select name="major" value={values.major} onChange={handleChange}>
                  <option value="">None</option>
                  {schools
                    .find((e) => e.name === values.school)
                    ?.programs.filter((e) => e.hasMajor)
                    .map((e, index) => (
                      <option key={`major-option-${index}`}>{e.name} ({e.short})</option>
                    ))}
                </Select>
              </div>
              <div>
                <div className="form-label-group">
                  <p>Minor</p>
                  <ErrorMessage name="minor" component={CustomErrorMessage} />
                </div>
                <Select name="minor" value={values.minor} onChange={handleChange}>
                  <option value="">None</option>
                  {schools
                    .find((e) => e.name === values.school)
                    ?.programs.filter((e) => e.hasMinor)
                    .map((e, index) => (
                      <option key={`minor-option-${index}`}>{e.name} ({e.short})</option>
                    ))}
                </Select>
              </div>
              <AnimatePresence>
                {updateStatus !== "" && (
                  <motion.div
                    initial={{ translateX: "-100%", opacity: 0 }}
                    animate={{ translateX: "0%", opacity: 1 }}
                    exit={{ translateX: "-100%", opacity: 0 }}
                    className={`text-white ${updateStatus === "success" && "bg-green-400"} ${
                      updateStatus === "failure" && "bg-red-400"
                    }border border-green-100 rounded-md p-2 flex items-center gap-2`}>
                    <CheckIcon size={25} />
                    {updateStatus === "success" && <p>Profile updated successfully</p>}
                    {updateStatus === "failure" && <p>Error updating profile</p>}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mx-auto">
                <Button type="submit">Save {isSubmitting && <LoadingIcon className="animate-spin" size={25} />}</Button>
              </div>
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
