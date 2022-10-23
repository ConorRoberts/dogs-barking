import { ApiMethod } from "~/types/ApiRoute";

const methodColours = {
  GET: "bg-green-500",
  POST: "bg-blue-500",
  PUT: "bg-orange-500",
  DELETE: "bg-red-500",
};

const ApiDocMethod = (props: ApiMethod) => {
  const { method, desc } = props;

  return (
    <div className="flex gap-2 items-center">
      <p className={`px-4 py-1.5 rounded-lg text-white ${methodColours[method]}`}>{method}</p>
      <p>{desc}</p>
    </div>
  );
};

export default ApiDocMethod;
