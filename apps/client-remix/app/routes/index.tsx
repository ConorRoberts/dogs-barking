import { EmptyStarIcon, PlannerIcon, SearchIcon } from "~/components/Icons";
import { APP_NAME } from "~/config/config";

const Page = () => {
  return (
    <div className="p-2 mx-auto max-w-6xl w-full flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <img
          src="/icons/Logo.svg"
          className="relative w-24 h-24 mx-auto shadow-md rounded-full"
          alt="SVG dog in white circle"
        />
        <h1 className="flex-1 text-center">{APP_NAME}</h1>
      </div>
      <div className="flex flex-col gap-4"></div>

      <div>
        <div className="flex gap-4 flex-wrap justify-center">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md py-12 px-4 flex flex-col gap-4 w-80">
            <SearchIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Find Information</h3>
              <p className="text-center">Find information about courses and programs at The University of Guelph</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md py-12 px-4 flex flex-col gap-4 w-80">
            <PlannerIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Plan Your Degree</h3>
              <p className="text-center">
                Plan your degree and our website will let you know if it meets the requirements for your major or minor
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md py-12 px-4 flex flex-col gap-4 w-80">
            <EmptyStarIcon size={60} className="text-gray-600 dark:text-gray-100 mx-auto" />
            <div>
              <h3 className="text-center text-xl">Give Feedback</h3>
              <p className="text-center">Rate courses on a number of metrics to give other students insight</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

