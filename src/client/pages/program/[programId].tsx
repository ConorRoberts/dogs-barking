import { API_URL } from "@config/config";
import Program from "@typedefs/Program";
import { NextPageContext } from "next";

const Page = () => {
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.programId as string;
  const data = await fetch(`${API_URL}/program/${id}`, { method: "GET" });
  const program: Program = await data.json();

  console.log(program);
  return {
    props: {
      program,
    },
  };
};

export default Page;
