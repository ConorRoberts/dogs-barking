import CourseGraph from "@components/CourseGraph";
import { API_URL } from "@config/config";
import Course from "@typedefs/Course";
import Program from "@typedefs/Program";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import { NextPageContext } from "next";
import { Edge, Node } from "react-flow-renderer";

interface PageProps {
  program: Program;
  nodes: Node<Course>[];
  edges: Edge[];
}

const Page = ({ program, nodes, edges }: PageProps) => {
  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="text-center grid gap-2">
        <h1>{program.name}</h1>
        <p>
          At<span className="mx-1 bg-white rounded-md dark:bg-gray-700 py-0.5 px-1">{program.school.name}</span>
        </p>
      </div>

      <CourseGraph nodes={nodes} edges={edges} />
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const programId = context.query.programId as string;

  const data = await fetch(`${API_URL}/program/${programId}`, { method: "GET" });
  const program = (await data.json()) as Program;

  const { nodes, edges } = createPrerequisiteGraph(program, { type: "Program" });

  return {
    props: {
      program,
      nodes,
      edges,
    },
  };
};

export default Page;
