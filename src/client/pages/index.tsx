import MetaData from "@components/MetaData";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Input } from "@components/form";
import Link from "next/link";
import useSearch from "@hooks/useSearch";
import { Random } from "@components/Icons";
import CourseGraph from "@components/CourseGraph";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import { Edge, Node } from "react-flow-renderer";
import { Auth } from "aws-amplify";
import axios from "axios";
import { API_URL } from "@config/config";
import Course from "@typedefs/Course";

interface PageProps {
  course: Course;
  school: string;
  edges: Edge[];
  nodes: Node[];
}

const Page = (props: PageProps) => {
  const [text, setText] = useState("");
  const [searchType, setSearchType] = useState<"course" | "program">("course");
  const { results } = useSearch(text, { type: searchType });
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
      <div className="flex flex-col gap-4">
        <div className="relative mx-auto max-w-xl w-full flex flex-col gap-2">
          <div
            className={`flex gap-4 items-center shadow-md dark:bg-gray-800 bg-white px-4 overflow-hidden rounded-t-md ${
              showResults && results.length > 0 ? "rounded-b-none" : "rounded-b-md"
            }`}>
            <Input
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder={searchType === "course" ? "Course code" : "Program code"}
              className={`py-3 text-xl font-light w-full dark:bg-gray-800`}
              onBlur={() => setTimeout(() => setShowResults(false), 100)}
              onFocus={() => setShowResults(true)}
              variant="blank"
            />
            {/* <Link passHref href={`/course/${props.course.id}`}>
              <div className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition">
                <Random size={20} />
              </div>
            </Link> */}
          </div>
          {showResults && (
            <div className="absolute rounded-b-xl top-full left-0 right-0 z-20 shadow-md bg-white overflow-hidden divide-y divide-gray-100">
              {results.slice(0, 10).map((e) => (
                <Link href={`/${searchType}/${e.id}`} key={e.id} passHref>
                  <div className="bg-white dark:bg-gray-800 px-4 py-0.5 bg-opacity-90 backdrop-filter backdrop-blur-sm hover:text-gray-500 dark:hover:text-gray-300 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16">
                    <p>{searchType === "course" ? e.code : e.short}</p>
                    <p className="truncate">{e.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="relative mx-auto max-w-xs w-full grid grid-cols-2 gap-2">
          <Button onClick={() => setSearchType("course")} variant={searchType === "course" ? "default" : "outline"}>
            Course
          </Button>
          <Button onClick={() => setSearchType("program")} variant={searchType === "program" ? "default" : "outline"}>
            Program
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-center">About</h3>
        <p className="">
          Welcome to Dogs Barking Inc! On this site we deliver an intuitive service that enables our users to quickly
          and easily filter through Course data that otherwise may be difficult to find on a school&apos;s native
          website. Users can view stylized graphs that are intertwined by their relationship to other courses.
        </p>
      </div>
      {/* <div className="text-center">
        <h3>Visualize Course Requirements</h3>
        <p className="dark:text-gray-400 text-gray-500 mb-4">
          Prerequisite graph for {props.course} from {props.school}
        </p>
        <CourseGraph nodes={props.nodes} edges={props.edges} />
      </div> */}
    </div>
  );
};

// export const getServerSideProps = async () => {
// Get data for CIS2750 from UOFG
// const data = await fetch(API_URL + "/course?code=CIS2750",{method:"GET"});
// const course = await data.json();
// console.log(course);
// const { nodes, edges } = createPrerequisiteGraph(course);

// return {
//   props: {
// randomCourse: course.id,
// course: course.code,
// school: course.school.name,
// nodes,
// edges,
//     },
//   };
// };

export default Page;
