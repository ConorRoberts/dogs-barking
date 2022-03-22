import MetaData from "@components/MetaData";
import getRandomCourse from "@utils/getRandomCourse";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@components/form";
import Link from "next/link";
import useCourseSearch from "@hooks/useCourseSearch";
import { Random } from "@components/Icons";

interface PageProps {
  randomCourseCode: string;
}

const Page = (props: PageProps) => {
  const [text, setText] = useState("");
  const { results } = useCourseSearch({ courseId: text });
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="p-2 mx-auto max-w-6xl w-full flex flex-col gap-16">
      <MetaData title="Home" />
      <div className="flex flex-col gap-8">
        <div className="relative w-24 h-24 mx-auto shadow-md rounded-full">
          <Image src="/icons/Logo.svg" layout="fill" objectFit="contain" />
        </div>
        <h1 className="flex-1 text-center">Dogs Barking Inc.</h1>
      </div>
      <div className="relative mx-auto max-w-lg w-full">
        <div
          className={`flex gap-4 items-center rounded-md shadow-md dark:bg-gray-800 bg-white px-4 ${
            showResults && results.length > 0 && "rounded-b-none"
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
          <div className="absolute rounded-xl top-full left-0 right-0 h-6 z-10">
            {results.slice(0, 10).map((e) => (
              <Link href={`/course/${e.nodeId}`} key={e.nodeId}>
                <p className="bg-white dark:bg-gray-800 px-4 py-0.5 bg-opacity-90 backdrop-filter backdrop-blur-sm hover:text-gray-500 dark:hover:text-gray-300 transition-all cursor-pointer duration-75 text-lg">
                  {e.id}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex gap-16 flex-col md:flex-row">
        <div className="w-[300px] md:w-[500px] h-64 relative md:flex-1">
          <Image
            src="/assets/graph-example-1.png"
            alt="Graphical Representation of UofG's CIS*3750"
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-3xl font-normal">Find your favourite courses</h3>
          <p>Use our website to see how your courses link together through prerequisites.</p>
          <p>
            In the image to the left, a graph for UofG&apos;s CIS*3750 is displayed. The yellow node is CIS*3750. As you
            can see from the graph, there are two main prerequisites that are required before CIS*3750 can be taken.
            These are CIS*2520 and CIS*2430. The edges of the nodes can be traced to determine a plan to be prepared to
            take CIS*3750.
          </p>
        </div>
      </div>
      {/* <p className="text-lg pb-10">
                        Welcome to Dogs Barking Inc! On this site we deliver an intuitive service that enables our users
                        to quickly and easily filter through Course data that otherwise may be difficult to find on a
                        school's native website. Users can view stylized graphs that are intertwined by their
                        relationship to other courses.
                    </p> */}
    </div>
  );
};

export const getServerSideProps = async () => {
  const course = await getRandomCourse();

  return {
    props: {
      randomCourseCode: course,
    },
  };
};

export default Page;
