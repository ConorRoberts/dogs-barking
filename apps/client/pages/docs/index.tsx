import ApiDocRoute from "@components/ApiDocRoute";
import React from "react";
import routes from "@data/api";

const Page = () => {
  return (
    <>
      <h2 className="text-center">Docs</h2>
      <div className="mx-auto max-w-3xl mt-8 flex flex-col w-full divide-y divide-gray-500">
        {routes.map((route) => (
          <ApiDocRoute {...route} key={route.path} />
        ))}
      </div>
    </>
  );
};

export default Page;
