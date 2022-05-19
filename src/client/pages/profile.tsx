import { Button, CustomErrorMessage, Input, Select } from "@components/form";
import { CheckIcon, ErrorIcon, LoadingIcon } from "@components/Icons";
import LoadingScreen from "@components/LoadingScreen";
import { AuthState, refreshToken, setUser } from "@redux/auth";
import { RootState } from "@redux/store";
import School from "@typedefs/School";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { API_URL } from "@config/config";
import Course from "@typedefs/Course";
import useSearch from "@hooks/useSearch";

interface PageProps {
  schools: School[];
}

type UpdateStatus = "" | "success" | "failure";

const Page = ({ schools }: PageProps) => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("");
  const router = useRouter();
  const [courseQuery, setCourseQuery] = useState<string>("");
  const { results } = useSearch(courseQuery, { type: "course" });
  const dispatch = useDispatch();
  const [showResults, setShowResults] = useState(false);
  const searchContainer = useRef(null);

  const [newTakenCourses, setNewTakenCourses] = useState([]);

  const toggleCourse = (course: Course) => {
    setNewTakenCourses(
      newTakenCourses.find((e) => e.id === course.id)
        ? newTakenCourses.filter((e) => e.id !== course.id)
        : [...newTakenCourses, course]
    );
  };

  useEffect(() => {
    if (!loading && !user) router.push("/error/403");
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div onClick={(e) => !searchContainer.current.contains(e.target) && setShowResults(false)}>
      <div className="mx-auto w-full max-w-3xl p-2">
        <h1 className="text-center">Profile</h1>
        <Formik
          initialValues={{
            school: user?.school?.id ?? "",
            email: user?.email,
            name: user?.name,
            major: user?.major?.id ?? "",
            minor: user?.minor?.id ?? "",
          }}
          onSubmit={async (values) => {
            let status: UpdateStatus = "success";

            try {
              const { data } = await axios.post(
                `/api/user`,
                { ...values, takenCourses: [...user.takenCourses, ...newTakenCourses].map((e) => e.id) },
                { headers: { Authorization: `Bearer ${user.token}` } }
              );
              dispatch(setUser({ ...user, takenCourses: data.takenCourses }));
            } catch (error) {
              dispatch(refreshToken());
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
                    <option key={`school-option-${index}`} value={e.id}>
                      {e.name}
                    </option>
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
                    .find((e) => e.id === values.school)
                    ?.programs.filter((e) => e.hasMajor)
                    .map((e, index) => (
                      <option key={`major-option-${index}`} value={e.id}>
                        {e.name} ({e.short})
                      </option>
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
                    .find((e) => e.id === values.school)
                    ?.programs.filter((e) => e.hasMinor)
                    .map((e, index) => (
                      <option key={`minor-option-${index}`} value={e.id}>
                        {e.name} ({e.short})
                      </option>
                    ))}
                </Select>
              </div>
              <div>
                <h3>Previously Taken Courses</h3>
                <div className="relative mx-auto max-w-xl w-full flex flex-col gap-2" ref={searchContainer}>
                  <div
                    className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white overflow-hidden rounded-t-md ${
                      showResults && results.length > 0 ? "rounded-b-none" : "rounded-b-md"
                    }`}>
                    <Input
                      onChange={(e) => setCourseQuery(e.target.value)}
                      value={courseQuery}
                      placeholder="Search for a course"
                      onFocus={() => setShowResults(true)}
                    />
                    {loading && (
                      <div className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition">
                        <LoadingIcon size={20} className="animate-spin" />
                      </div>
                    )}
                  </div>
                  {showResults && (
                    <div className="absolute rounded-b-xl top-full left-0 right-0 z-20 shadow-md bg-white overflow-hidden divide-y divide-gray-100">
                      {results.map((e) => (
                        <div
                          onClick={() => toggleCourse(e)}
                          key={e.id}
                          className={` ${
                            [...newTakenCourses, ...user.takenCourses].find((c) => c.id === e.id)
                              ? "bg-blue-500 text-white hover:text-gray-200"
                              : "bg-white dark:bg-gray-800 hover:text-gray-500 dark:hover:text-gray-300"
                          } px-4 py-0.5 bg-opacity-90 backdrop-filter backdrop-blur-sm transition-all cursor-pointer duration-75 flex justify-between gap-8 sm:gap-16`}>
                          <p>{e.code}</p>
                          <p className="truncate">{e.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {user.takenCourses
                    .slice()
                    .sort((a, b) => a.code.localeCompare(b.code))
                    .map((e, index) => (
                      <div key={`taken-course-${index}`}>
                        <p className="text-center">{e.code}</p>
                      </div>
                    ))}
                </div>
              </div>
              <AnimatePresence>
                {updateStatus !== "" && (
                  <motion.div
                    initial={{ translateX: "-100%", opacity: 0 }}
                    animate={{ translateX: "0%", opacity: 1 }}
                    exit={{ translateX: "-100%", opacity: 0 }}
                    className={`text-white ${updateStatus === "success" && "bg-green-400"} ${
                      updateStatus === "failure" && "bg-red-400"
                    } border border-green-100 dark:border-green-800 rounded-md p-2 flex items-center gap-2`}>
                    {updateStatus === "success" && <CheckIcon size={25} />}
                    {updateStatus === "failure" && <ErrorIcon size={25} />}
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
  const data = await fetch(API_URL + "/school");
  const schools = await data.json();

  return {
    props: {
      schools,
    },
  };
};

export default Page;
