import { SearchIcon } from "@components/Icons";
import MetaData from "@components/MetaData";
import { setOpen } from "@redux/search";
import Image from "next/image";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

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
        <div
          className="bg-white dark:bg-gray-700 rounded-md overflow-hidden px-4 py-1 shadow-md mx-auto w-72 text-lg font-medium flex items-center gap-2 cursor-pointer hover:dark:bg-gray-800 hover:bg-gray-100 transition"
          onClick={() => dispatch(setOpen(true))}>
          <SearchIcon size={25} />
          <p>Search here</p>
          <kbd className="ml-auto opacity-60 text-sm">CTRL + K</kbd>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-center">About</h3>
        <p>
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

export default Page;
