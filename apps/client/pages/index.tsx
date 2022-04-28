import MetaData from "@components/MetaData";
import getRandomCourse from "@utils/getRandomCourse";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@components/form";
import Link from "next/link";
import useSearch from "@hooks/useSearch";
import { Random } from "@components/Icons";
import CourseGraph from "@components/CourseGraph";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import { Edge, Node } from "react-flow-renderer";
import getPrerequisites from "@utils/getPrerequisites";

interface PageProps {
  randomCourseCode: string;
  edges: Edge[];
  nodes: Node[];
}

const Page = (props: PageProps) => {
  const [text, setText] = useState("");
  const { results } = useSearch(text);
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="p-2 mx-auto max-w-4xl w-full flex flex-col gap-16">
      <MetaData title="Home" />
      <div className="flex flex-col gap-8">
        <div className="relative w-24 h-24 mx-auto shadow-md rounded-full">
          <Image src="/icons/Logo.svg" layout="fill" objectFit="contain" alt="SVG dog in white circle" />
        </div>
        <h1 className="flex-1 text-center">Dogs Barking Inc.</h1>
      </div>
      <div className="relative mx-auto max-w-xl w-full">
        <h3 className="text-xl font-normal text-center mb-2">Find your favourite courses</h3>

        <div
          className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-t-md ${
            showResults && results.length > 0 ? "rounded-b-none" : "rounded-b-md"
          }`}>
          <Input
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Course code"
            className={`py-3 text-xl font-light w-full dark:bg-gray-800`}
            onBlur={() => setTimeout(() => setShowResults(false), 100)}
            onFocus={() => setShowResults(true)}
            variant="blank"
          />
          <Link passHref href={"/course/" + props.randomCourseCode}>
            <div>
              <Random className="w-5 h-5 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition" />
            </div>
          </Link>
        </div>
        {showResults && (
          <div className="absolute rounded-b-xl top-full left-0 right-0 z-10 shadow-md bg-white overflow-hidden divide-y divide-gray-100">
            {results.slice(0, 10).map((e) => (
              <Link href={`/course/${e.id}`} key={e.id} passHref>
                <div className="bg-white dark:bg-gray-800 px-4 py-0.5 bg-opacity-90 backdrop-filter backdrop-blur-sm hover:text-gray-500 dark:hover:text-gray-300 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16">
                  <p>{e.code}</p>
                  <p className="truncate">{e.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-center">About</h3>
        <p className="">
          Welcome to Dogs Barking Inc! On this site we deliver an intuitive service that enables our users to quickly
          and easily filter through Course data that otherwise may be difficult to find on a school&apos;s native
          website. Users can view stylized graphs that are intertwined by their relationship to other courses.
        </p>
      </div>
      <div className="text-center">
        <h3>Visualize Course Requirements</h3>
        <p className="dark:text-gray-400 text-gray-500 mb-4">
          Prerequisite graph for CIS*2750 from The University of Guelph
        </p>
        <CourseGraph nodes={props.nodes} edges={props.edges} />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const course = await getRandomCourse();
  const { nodes, edges } = createPrerequisiteGraph(await getPrerequisites("284"));

  return {
    props: {
      randomCourseCode: course,
      nodes,
      edges,
    },
  };
};

export default Page;
