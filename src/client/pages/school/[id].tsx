import { API_URL } from "@config/config";
import School from "@typedefs/School copy";
import { NextPageContext } from "next";

const Page = ({ school }) => {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center flex flex-col gap-1">
        <h1>{school.name}</h1>
        {/* <h5 className="text-gray-600">{school.city}</h5>
        <p className="text-gray-500">{school.abbrev}</p> */}
      </div>
      <div>
        <p>Easiest Courses</p>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.id as string;
  const data = await fetch(`${API_URL}/school/${id}`, { method: "GET" });
  const school = (await data.json()) as School;

  return {
    props: {
      school,
    },
  };
};

export default Page;
