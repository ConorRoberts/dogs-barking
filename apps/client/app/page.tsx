import { EmptyStarIcon, PlannerIcon, SearchIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import { APP_NAME } from "~/config/config";
import Image from "next/image";
import FeatureGridItem from "~/components/home/FeatureGridItem";
import HomeSearchModalButton from "~/components/home/HomeSearchModalButton";

const Page = () => {
  return (
    <div className="p-2 mx-auto max-w-6xl w-full flex flex-col gap-16">
      {/* <MetaData title="Home" description="Find your favourite courses and provide feedback!" /> */}
      <div className="flex flex-col gap-8">
        <Image
          src="/icons/Logo.svg"
          width={96}
          height={96}
          className="relative w-24 h-24 mx-auto shadow-md rounded-full"
          alt="SVG dog in white circle"
        />
        <h1 className="flex-1 text-center">{APP_NAME}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <HomeSearchModalButton />
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
