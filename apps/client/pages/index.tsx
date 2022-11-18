import { EmptyStarIcon, PlannerIcon, SearchIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import { APP_NAME } from "~/config/config";
import Image from "next/image";
import useSearchModalStore from "~/store/searchModalStore";
import FeatureGridItem from "~/components/home/FeatureGridItem";

const Page = () => {
  const { setOpen } = useSearchModalStore(({ setOpen }) => ({ setOpen }));
  return (
    <div className="p-2 mx-auto max-w-6xl w-full flex flex-col gap-16">
      <MetaData title="Home" description="Find your favourite courses and provide feedback!" />
      <div className="flex flex-col gap-8">
        <div className="relative w-24 h-24 mx-auto shadow-md rounded-full">
          <Image src="/icons/Logo.svg" layout="fill" objectFit="contain" alt="SVG dog in white circle" />
        </div>
        <h1 className="flex-1 text-center">{APP_NAME}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-md overflow-hidden px-6 py-2 shadow-center mx-auto w-80 text-lg font-medium flex items-center gap-4 cursor-pointer hover:dark:bg-gray-700 hover:bg-gray-100 transition"
          id="home-search-button"
          onClick={() => setOpen(true)}
        >
          <SearchIcon size={25} />
          <p className="text-lg">Search</p>
          <kbd className="ml-auto opacity-60 text-sm">CTRL + K</kbd>
        </div>
      </div>

      <div>
        <div className="flex gap-4 flex-wrap justify-center">
          <FeatureGridItem>
            <SearchIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Find Information</h3>
              <p className="text-center">Find information about courses and programs at The University of Guelph</p>
            </div>
          </FeatureGridItem>
          <FeatureGridItem>
            <PlannerIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Plan Your Degree</h3>
              <p className="text-center">
                Plan your degree and our website will let you know if it meets the requirements for your major or minor
              </p>
            </div>
          </FeatureGridItem>
          <FeatureGridItem>
            <EmptyStarIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Give Feedback</h3>
              <p className="text-center">Rate courses on a number of metrics to give other students insight</p>
            </div>
          </FeatureGridItem>
        </div>
      </div>
    </div>
  );
};

export default Page;
