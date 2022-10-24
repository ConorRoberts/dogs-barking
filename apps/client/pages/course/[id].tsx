import Course from "~/types/Course";
import { GetServerSideProps, NextPage } from "next";
import Rating from "~/components/Rating";
import Link from "next/link";
import MetaData from "~/components/MetaData";
import { API_URL } from "~/config/config";
import { useState } from "react";
import RequirementsList from "~/components/RequirementsList";
import CourseSection from "~/components/CourseSection";
import Section from "~/types/Section";
import Requirement from "~/types/Requirement";
import { useEffect } from "react";

interface PageProps {
  course: Course;
  sections: Section[];
  nodes: Record<string, Requirement>;
}

const Page: NextPage<PageProps> = ({ course, sections, nodes }) => {
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    setRatingCount(course.rating.count);
  }, [course.rating.count]);

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
            key={`course-${course.id}-difficulty`}
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
            key={`course-${course.id}-usefulness`}
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
            key={`course-${course.id}-timeSpent`}
          />
        </div>
      </div>
      {course.rating.count !== undefined && (
        <p className="text-gray-500 text-center">
          This course has been rated {ratingCount} time
          {(ratingCount > 1 || ratingCount === 0) && "s"}
        </p>
      )}

      {course.requirements.length > 0 && (
        <>
          <h2 className="text-center">Requirements</h2>
          <RequirementsList requirements={course.requirements} nodes={nodes} />
        </>
      )}
      {sections.length > 0 && (
        <div>
          <h2 className="text-center">Sections</h2>
          <p className="text-center text-gray-500 dark:text-gray-500 mb-1">
            Here are the current offerings for {course.code}
          </p>

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

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
  // Cache
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=3600");

  const id = query.id as string;

  const { course, nodes }: { course: Course; nodes: Record<string, Requirement> } = await fetch(
    `${API_URL}/course/${id}`,
    { method: "GET" }
  ).then((res) => res.json());

  const sections: Section[] = await fetch(`${API_URL}/course/${id}/section`, { method: "GET" }).then((res) =>
    res.json()
  );

  // We couldn't find course or course isn't a valid course
  if (!course) {
    return {
      redirect: {
        destination: "/error/404",
        permanent: false,
      },
    };
  }

  // const { nodes, edges } = createPrerequisiteGraph(course, flatNodeList);

  return {
    props: {
      course,
      sections,
      nodes,
    },
  };
};

export default Page;
