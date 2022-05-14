import Course from "@typedefs/Course";
import { NextPageContext } from "next";
import CourseGraph from "@components/CourseGraph";
import { Node, Edge } from "react-flow-renderer";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import Rating from "@components/Rating";
import Link from "next/link";
import MetaData from "@components/MetaData";
import { API_URL } from "@config/config";
import courseSchema from "@schema/courseSchema";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "@components/LoadingScreen";

interface PageProps {
  course: Course;
  nodes: Node<Course>[];
  edges: Edge[];
}

const Page = ({ course, nodes, edges }: PageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!course) router.push("/error/404");
  }, [router, course]);

  if (!course) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-8 p-2">
      <MetaData description={course.description} title={`${course.name} (${course.code})`} />
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

      <div className="flex flex-row items-center gap-4 justify-center flex-wrap w-full">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="difficulty"
            name="Difficulty"
            initialRating={course.rating.difficulty}
          />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="usefulness"
            name="Usefulness"
            initialRating={course.rating.usefulness}
          />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="timeSpent"
            name="Time Spent"
            initialRating={course.rating.timeSpent}
          />
        </div>
      </div>
      {course.rating.count !== undefined && (
        <p className="text-gray-500 text-center">
          This course has been rated {course.rating.count} time{course.rating.count > 1 && "s"}
        </p>
      )}
      <div>
        <h3 className="text-center mb-1">Prerequisites</h3>
        <CourseGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.id as string;
  const data = await fetch(`${API_URL}/course/${id}`, { method: "GET" });
  const course: Course = await data.json();

  // We couldn't find course or course isn't a valid course
  if (!courseSchema.isValidSync(course)) {
    return {
      props: {
        course: null,
        nodes: [],
        edges: [],
      },
    };
  }

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
