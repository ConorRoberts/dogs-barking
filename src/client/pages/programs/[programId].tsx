import Course from "@typedefs/Course";
import Program from "@typedefs/Program";
import School from "@typedefs/School";
import { NextPageContext } from "next";
import React from "react";
import { Edge, Node } from "react-flow-renderer";

interface programGraph {
  nodes: Node<Course>[];
  edges: Edge[];
}
interface PageProps {
  program: Program;
  school: School;
  major: programGraph;
  minor: programGraph;
  area: programGraph;
}

const Page = ({ program, school, major, minor, area }: PageProps) => {
  return (
    <div>
      <h2 className="text-center text-slate-800">{program.name ?? program.id}</h2>
      <p className="text-center text-slate-800">{school.name}</p>
    </div>
  );
};

// export const getServerSideProps = async (context: NextPageContext) => {
//   const programId = context.query.programId as string;

//   return {
//     props: {
//       program: null,
//       school: null,
//     },
//   };
// };

export default Page;
