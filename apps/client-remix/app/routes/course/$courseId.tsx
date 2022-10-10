import Course from "~/types/Course";
import { Node } from "react-flow-renderer";
import createPrerequisiteGraph from "~/utils/createPrerequisiteGraph";
import Rating from "~/components/Rating";
import { Link, useLoaderData } from "@remix-run/react";
import { API_URL } from "~/config/config";
import courseSchema from "~/schema/courseSchema";
import { useEffect, useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import RequirementsList from "~/components/RequirementsList";
import CourseSection from "~/components/CourseSection";
import { json, LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import Section from "~/types/Section";
import constructRouteTitle from "~/utils/constructRouteTitle";

interface LoaderData {
  course: Course;
  nodes: Node<Course>[];
  edges: Node<any>[];
  sections: Section[];
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return { title: constructRouteTitle(data.course.name) };
};

const Page = () => {
  const { course, sections } = useLoaderData<LoaderData>();
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    setRatingCount(course.rating.count);
  }, []);

  if (!course) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-8 p-4">
      {/* <MetaData description={course.description} title={`${course.name} (${course.code})`} /> */}
      <div>
        <h1 className="text-center mb-1">{course.name}</h1>
        <h2 className="subheading text-center">{course.code}</h2>
        <div className="flex justify-center">
          <Link to={`/school/${course.school.id}`} className="text-gray-400">
            {course.school.name}
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

          {/* {sectionsLoading && <LoadingIcon className="animate-spin mx-auto" size={25} />} */}
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

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.courseId as string;
  const course: Course = await fetch(`${API_URL}/course/${id}`, { method: "GET" }).then((res) => res.json());
  const sections: Section[] = await fetch(`${API_URL}/course/${id}/section`, { method: "GET" }).then((res) =>
    res.json()
  );

  // We couldn't find course or course isn't a valid course
  if (!courseSchema.isValidSync(course)) {
    return redirect("/");
  }

  const { nodes, edges } = createPrerequisiteGraph(course, course.requirements);

  return json<LoaderData>({
    course,
    nodes,
    edges,
    sections,
  });
};

export default Page;
