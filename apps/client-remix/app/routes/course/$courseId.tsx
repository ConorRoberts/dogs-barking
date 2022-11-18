import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { API_URL } from "~/config/config";
import Course from "~/types/Course";

export const loader = async ({ params }: LoaderArgs) => {
  const { courseId } = params;
  const data = await fetch(`${API_URL}/course/${courseId}`);
  const { course }: { course: Course } = await data.json();
  return json({ course });
};

const Page = () => {
  const { course } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  );
};

export default Page;
