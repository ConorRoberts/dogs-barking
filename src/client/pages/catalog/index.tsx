import MetaData from "@components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { LoadingIcon } from "@components/Icons";
import Program from "@typedefs/Program";
import Course from "@typedefs/Course";
import CourseQueryApiResponse from "@typedefs/CourseQueryAPIResponse";
import CatalogCourse from "@components/CatalogCourse";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totals, setTotal] = useState({ course: 0, program: 0 });
  const type: "course" | "program" = "course";

  const submitQuery = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    if (type === "course") {
      try {
        const { data } = await axios.get<CourseQueryApiResponse>("/api/course");
        setCourses(data.courses);
      } catch (error) {
        setCourses([]);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    submitQuery();
  }, [submitQuery]);

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
      <MetaData title="Catalog" description="Search for courses and programs in our database." />
      <div className="text-center mb-8">
        <h1>Catalog</h1>
      </div>
      <div>
        {loading && <LoadingIcon size={45} className="animate-spin text-gray-500" />}
        {!loading && (
          <ul className="scrollbar scrollbar-track-y-transparent">
            {courses
              ?.sort((a, b) => a.code.localeCompare(b.code))
              .map((course) => (
                <CatalogCourse key={course.id} course={course} />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;
