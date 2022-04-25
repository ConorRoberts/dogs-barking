import Course from "@dogs-barking/common/types/Course";
import School from "@dogs-barking/common/types/School";
import getCourse from "@utils/getCourse";
import getCourseSchool from "@utils/getCourseSchool";
import { NextPageContext } from "next";
import CourseGraph from "@components/CourseGraph";
import { Node, Edge } from "react-flow-renderer";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import Rating from "@components/Rating";
import getPrerequisites from "@utils/getPrerequisites";
import getRating from "@utils/getRating";
import Link from "next/link";

interface PageProps {
  course: Course;
  school: any;
  nodes: Node<Course>[];
  edges: Edge[];
  rating: {
    difficulty: number;
    usefulness: number;
    timeSpent: number;
  };
}

const Page = ({ course, school, nodes, edges, rating }: PageProps) => {
  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-8 p-2">
      <div>
        <h2 className="text-center mb-1">
          {course.name} ({course.id})
        </h2>
        <Link passHref href={`/school/${school.nodeId}`}>
          <p className="text-center text-gray-400">{school.name}</p>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <p>{course.description}</p>
        <p>
          This course is worth <span className="text-blue-500 dark:text-blue-400">{course.weight}</span> credit(s)
        </p>
      </div>

      <div className="flex flex-row items-center gap-4 justify-center flex-wrap w-full">
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Difficulty</h3>
          <Rating nodeId={course.nodeId} ratingType="difficulty" initialRating={rating.difficulty} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Usefulness</h3>
          <Rating nodeId={course.nodeId} ratingType="usefulness" initialRating={rating.usefulness} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <h3 className="text-center">Time Spent</h3>
          <Rating nodeId={course.nodeId} ratingType="timeSpent" initialRating={rating.timeSpent} />
        </div>
      </div>
      <div>
        <h3 className="text-center mb-1">Prerequisites</h3>
        <CourseGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.id as string;
  const course = await getCourse(id);
  const school = await getCourseSchool(id);
  const courses = await getPrerequisites(id);
  const { nodes, edges } = createPrerequisiteGraph(courses);
  const rating = await getRating(id);

  return {
    props: {
      course,
      school,
      nodes,
      edges,
      rating,
    },
  };
};

export default Page;
