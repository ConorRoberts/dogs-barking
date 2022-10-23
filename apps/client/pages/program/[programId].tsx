import CourseGraph from "~/components/graph/CourseGraph";
import { Button } from "@conorroberts/beluga";
import { GraphIcon } from "~/components/Icons";
import MetaData from "~/components/MetaData";
import RequirementsList from "~/components/RequirementsList";
import { API_URL } from "~/config/config";
import Course from "~/types/Course";
import Program from "~/types/Program";
import createPrerequisiteGraph from "~/utils/createPrerequisiteGraph";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { Edge, Node } from "react-flow-renderer";

interface PageProps {
  program: Program;
  majorGraph: {
    nodes: Node<Course>[];
    edges: Edge[];
  };
  minorGraph: {
    nodes: Node<Course>[];
    edges: Edge[];
  };
}

const Page = ({ program, majorGraph, minorGraph }: PageProps) => {
  const [viewType, setViewType] = useState<"default" | "graph">("default");
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-16">
      <MetaData title={program.name} />
      <div className="text-center grid gap-2">
        <h1>{program.name}</h1>
        <Link href={`/school/${program.school.id}`} passHref>
          <a className="primary-hover">At {program.school.name}</a>
        </Link>
      </div>

      <div>
        <div className="flex gap-2 items-center">
          <h2 className="mb-2 text-center">Requirements</h2>
          <Button variant="outlined" onClick={() => setViewType(viewType === "default" ? "graph" : "default")}>
            <GraphIcon size={25} />
            <p className="sm:block hidden">View Graph</p>
          </Button>
        </div>
        {/* {viewType === "default" && program.major.length > 0 && <RequirementsList requirements={program.major} />}
        {viewType === "graph" && program.major.length > 0 && (
          <CourseGraph nodes={majorGraph.nodes} edges={majorGraph.edges} />
        )}
        {viewType === "default" && program.minor.length > 0 && <RequirementsList requirements={program.minor} />}
        {viewType === "graph" && program.minor.length > 0 && (
          <CourseGraph nodes={minorGraph.nodes} edges={minorGraph.edges} />
        )} */}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const programId = context.query.programId as string;

  const data = await fetch(`${API_URL}/program/${programId}`, { method: "GET" });
  const program = (await data.json()) as Program;

  // const { nodes: majorNodes, edges: majorEdges } = createPrerequisiteGraph(program, program.major, {
  //   type: "Program",
  // });
  // const { nodes: minorNodes, edges: minorEdges } = createPrerequisiteGraph(program, program.minor, {
  //   type: "Program",
  // });

  return {
    props: {
      program,
      majorGraph: {
        nodes: [],
        edges: [],
      },
      minorGraph: {
        nodes: [],
        edges: [],
      },
    },
  };
};

export default Page;
