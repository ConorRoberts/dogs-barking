import Course from "@typedefs/Course";
import { NextPageContext } from "next";
import CourseGraph from "@components/CourseGraph";
import { Node, Edge } from "react-flow-renderer";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import Rating from "@components/Rating";
import Link from "next/link";
import RatingData from "@typedefs/RatingData";
import MetaData from "@components/MetaData";

interface PageProps {
  course: Course;
  nodes: Node<Course>[];
  edges: Edge[];
  rating: RatingData;
}

const Page = ({ course, nodes, edges, rating }: PageProps) => {
  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-8 p-2">
      <MetaData title={course.code}>
        <meta property="og:title" content={course.code} />
        <meta property="og:description" content={`${course.name} - ${course.description}`} />
      </MetaData>
      <div>
        <h2 className="text-center mb-1">
          {course.name} ({course.code})
        </h2>
        <Link passHref href={`/school/${course.school.id}`}>
          <p className="text-center text-gray-400">{course.school.name}</p>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <p>{course.description}</p>
        <p>
          This course is worth <span className="text-blue-500 dark:text-blue-400">{course.credits}</span> credit(s)
        </p>
      </div>

      {/* <div className="flex flex-row items-center gap-4 justify-center flex-wrap w-full">
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Difficulty</h3>
          <Rating courseId={course.id} ratingType="difficulty" initialRating={rating.difficulty} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Usefulness</h3>
          <Rating courseId={course.id} ratingType="usefulness" initialRating={rating.usefulness} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Time Spent</h3>
          <Rating courseId={course.id} ratingType="timeSpent" initialRating={rating.timeSpent} />
        </div>
      </div> */}
      {/* {rating.ratingCount !== undefined && (
        <p className="text-gray-500 text-center">
          This course has been rated {rating.ratingCount} time{rating.ratingCount > 1 && "s"}
        </p>
      )} */}
      <div>
        <h3 className="text-center mb-1">Prerequisites</h3>
        <CourseGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.id as string;
  const course = await (await fetch(`https://api.dogs-barking.ca/course/${id}`, { method: "GET" })).json();
  const { nodes, edges } = createPrerequisiteGraph(course);

  return {
    props: {
      course,
      nodes,
      edges,
    },
  };
};

export default Page;
