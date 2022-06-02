import CourseGraph from "@components/CourseGraph";
import { Button } from "@components/form";
import { GraphIcon } from "@components/Icons";
import RequirementsList from "@components/RequirementsList";
import { API_URL } from "@config/config";
import Course from "@typedefs/Course";
import Program from "@typedefs/Program";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import { NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";
import { Edge, Node } from "react-flow-renderer";

interface PageProps {
  program: Program;
  nodes: Node<Course>[];
  edges: Edge[];
}

const Page = ({ program, nodes, edges }: PageProps) => {
  const [viewType, setViewType] = useState<"default" | "graph">("default");
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-16">
      <div className="text-center grid gap-2">
        <h1>{program.name}</h1>
        <Link href={`/school/${program.school.id}`} passHref>
          <a className="primary-hover">
            At {program.school.name}
          </a>
        </Link>
      </div>

      <div>
        <div className="flex gap-2 items-center">
          <h2 className="mb-2 text-center">Requirements</h2>
          <Button variant="outline" onClick={() => setViewType(viewType === "default" ? "graph" : "default")}>
            <GraphIcon size={25} />
            <p className="sm:block hidden">View Graph</p>
          </Button>
        </div>
        {viewType === "default" && <RequirementsList requirements={program.requirements} />}
        {viewType === "graph" && <CourseGraph nodes={nodes} edges={edges} />}
      </div>
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
