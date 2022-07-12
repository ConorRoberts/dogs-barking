import React from "react";
import MetaData from "@components/MetaData";
import { NextApiRequest } from "next";

const errors = {
  404: {
    title: "Resource not found",
  },
  403: {
    title: "Unauthorized access",
    description: "You do not have permission to view this page",
  },
  "": {
    title: "",
    description: "",
  },
};

const Error = ({ id = "" }) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <MetaData title="Error" />
      <div className="w-full max-w-md mx-2 sm:px-12 py-12 px-6  rounded-md bg-white dark:bg-gray-800 shadow-center-sm">
        <h2>{`Error (${id})`}</h2>
        <h3>{`${errors[id].title}`}</h3>
        <p>{errors[id].description}</p>
      </div>
    </div>
  );
};

export const getServerSideProps = (req: NextApiRequest) => {
  const { id } = req.query;

  return { props: { id } };
};

export default Error;
