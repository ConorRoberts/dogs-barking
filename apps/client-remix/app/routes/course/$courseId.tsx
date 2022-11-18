import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  return json({});
};

const $courseId = () => {
  return <div>
    <h1>Course</h1>
  </div>;
};

export default $courseId;
