import Course from "@typedefs/Course";
import { NextPageContext } from "next";
import { Node, Edge } from "react-flow-renderer";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import Rating from "@components/Rating";
import Link from "next/link";
import MetaData from "@components/MetaData";
import { API_URL } from "@config/config";
import courseSchema from "@schema/courseSchema";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "@components/LoadingScreen";
import RequirementsList from "@components/RequirementsList";
import axios from "axios";
import CourseSection from "@components/CourseSection";
import { LoadingIcon } from "@components/Icons";

interface PageProps {
  course: Course;
  nodes: Node<Course>[];
  edges: Edge[];
}

const Page = ({ course }: PageProps) => {
  const router = useRouter();
  const [ratingCount, setRatingCount] = useState(course.rating.count);
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  useEffect(() => {
    if (!course) router.push("/error/404");
  }, [router, course]);

  useEffect(() => {
    (async () => {
      try {
        setSectionsLoading(true);
        const { data } = await axios.get(`/api/course/${course.id}/section`);
        setSections(data);
      } catch (error) {
        console.error(error);
      } finally {
        setSectionsLoading(false);
      }
    })();
  }, [course.id]);

  if (!course) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-8 p-4">
      <MetaData description={course.description} title={`${course.name} (${course.code})`} />
      <div>
        <h1 className="text-center mb-1">{course.name}</h1>
        <h2 className="subheading text-center">{course.code}</h2>
        <div className="flex justify-center">
          <Link passHref href={`/school/${course.school.id}`}>
            <a className="text-gray-400">{course.school.name}</a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p>{course.description}</p>
        <p>
          This course is worth <span className="font-semibold">{course.credits}</span> credit(s)
        </p>
      </div>

      <div className="flex flex-row items-center gap-4 justify-center flex-wrap w-full">
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="difficulty"
            name="Difficulty"
            initialRating={course.rating.difficulty}
            setRatingCount={setRatingCount}
            tooltip="How difficult was this course?"
          />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="usefulness"
            name="Usefulness"
            initialRating={course.rating.usefulness}
            setRatingCount={setRatingCount}
            tooltip="How useful was this course to you?"
          />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <Rating
            courseId={course.id}
            ratingType="timeSpent"
            name="Time Spent"
            initialRating={course.rating.timeSpent}
            setRatingCount={setRatingCount}
            tooltip="Hours spent per week"
            labelLow="<1h"
            labelHigh=">24h"
          />
        </div>
      </div>
      {course.rating.count !== undefined && (
        <p className="text-gray-500 text-center">
          This course has been rated {ratingCount} time
          {(ratingCount > 1 || ratingCount === 0) && "s"}
        </p>
      )}

      {course.requirements.filter((e) => e.label !== "AndBlock").length > 0 && (
        <>
          <h2 className="text-center">Requirements</h2>
          <RequirementsList requirements={course.requirements.filter((e) => e.label !== "AndBlock")} />
        </>
      )}
      {sections.length > 0 && (
        <div>
          <h2 className="text-center">Sections</h2>
          <p className="text-center text-gray-500 dark:text-gray-500 mb-1">
            Here are the current offerings for {course.code}
          </p>

          {sectionsLoading && <LoadingIcon className="animate-spin mx-auto" size={25} />}
          <div className="grid gap-2 sm:grid-cols-2">
            {sections.map((section, index) => (
              <CourseSection section={section} key={`${course.id} section ${index}`} />
            ))}
          </div>
        </div>
      )}
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

  const { nodes, edges } = createPrerequisiteGraph(course, course.requirements);

  return {
    props: {
      course,
      nodes,
      edges,
    },
  };
};

export default Page;
