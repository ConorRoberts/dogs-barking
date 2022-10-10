import React from "react";
import { AiOutlineLoading as LoadingIcon } from "react-icons/ai";

const LoadingScreen = () => {
  return (
    <div className="flex-1 flex justify-center items-center w-full">
      <LoadingIcon className="animate-spin w-16 h-16 text-black dark:text-white" />
    </div>
  );
};

export default LoadingScreen;
