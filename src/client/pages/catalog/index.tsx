import MetaData from "@components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { LoadingIcon } from "@components/Icons";
import Program from "@typedefs/Program";
import Course from "@typedefs/Course";
import CourseQueryApiResponse from "@typedefs/CourseQueryAPIResponse";
import CatalogCourse from "@components/CatalogCourse";
import { Button, Input } from "@components/form";
import Checkbox from "@components/form/Checkbox";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totals, setTotals] = useState({ course: 0, program: 0 });
  const [page, setPage] = useState(0);
  const type: "course" | "program" = "course";

  const submitQuery = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      setLoading(true);

      if (type === "course") {
        try {
          const { data } = await axios.get<CourseQueryApiResponse>("/api/course", {
            params: { pageSize: 50, pageNum: page },
          });
          setCourses(data.courses);
          setTotals((prev) => ({ ...prev, course: data.total }));
        } catch (error) {
          setCourses([]);
        }
      }

      setLoading(false);
    },
    [page]
  );

  useEffect(() => {
    submitQuery();
  }, [submitQuery]);

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
      <MetaData title="Catalog" description="Search for courses and programs in our database." />
      <div className="text-center mb-8">
        <h1>Catalog</h1>
      </div>
      {loading && <LoadingIcon size={45} className="animate-spin text-gray-500 mx-auto" />}
      {!loading && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Input />

              <div className="flex gap-4">
                <Checkbox value={true} />
                <div className="h-6 w-16 bg-blue-500"></div>
              </div>
              <div className="flex gap-4">
                <Checkbox value={true} />
                <div className="h-6 w-16 bg-blue-500"></div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <p className="bg-blue-500 rounded-full py-1 px-4">Filter</p>
              <p className="bg-blue-500 rounded-full py-1 px-4">Filter</p>
              <p className="bg-blue-500 rounded-full py-1 px-4">Filter</p>
              <p className="bg-blue-500 rounded-full py-1 px-4">Filter</p>
              <p className="bg-blue-500 rounded-full py-1 px-4">Filter</p>
            </div>
          </div>
          <p>Showing 1 - 50 of {totals.course} results</p>
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Next
          </Button>
          <Button variant="outline" onClick={() => setPage(page - 1 < 0 ? 0 : page - 1)}>
            Previous
          </Button>
          <ul className="scrollbar scrollbar-track-y-transparent">
            {courses
              ?.sort((a, b) => a.code.localeCompare(b.code))
              .map((course) => (
                <CatalogCourse key={course.id} course={course} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;
