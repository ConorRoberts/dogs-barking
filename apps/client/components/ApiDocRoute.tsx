import React from "react";
import ApiRoute from "~/types/ApiRoute";
import ApiDocMethod from "~/components/ApiDocMethod";

/**
 * Represents a route within the api docs
 * @param props
 * @returns
 */
const ApiDocRoute = (props: ApiRoute) => {
  const { path, methods } = props;

  return (
    <div className="py-5">
      <p className="text-xl font-light mb-4">{path}</p>
      {methods.map((e) => (
        <ApiDocMethod {...e} key={`${path}-${e.method}`} />
      ))}
    </div>
  );
};

export default ApiDocRoute;
