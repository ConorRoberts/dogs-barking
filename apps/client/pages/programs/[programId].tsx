import CourseGraph from "@components/CourseGraph";
import Course from "@dogs-barking/common/types/Course";
import Program from "@dogs-barking/common/types/Program";
import School from "@dogs-barking/common/types/School";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import getProgram from "@utils/getProgram";
import getProgramPrerequisites from "@utils/getProgramPrerequisites";
import getProgramSchool from "@utils/getProgramSchool";
import { NextPageContext } from "next";
import React from "react";
import { Edge, Node } from "react-flow-renderer";

interface PageProps {
  program: Program;
  school: School;
  nodes: Node<Course>[];
  edges: Edge[];
}
const Page = ({ program, school, nodes, edges }: PageProps) => {
  return (
    <div>
      <h2 className="text-center text-slate-800">{program.name ?? program.id}</h2>
      <p className="text-center text-slate-800">{school.name}</p>

      {/* {programData && (
        <div className="text-center text-slate-600">
          <div>
            <h3>
              {programData.name} : {programData.id}
            </h3>
          </div>
          <div>
            <p>
              <i>Degree : {programData.degree}</i>
            </p>
          </div>
        </div>
      )}
      {majorCourses?.length > 0 && (
        <>
          <div className="h-10"></div>
          <div className="flow-root">
            <div className="text-zinc-600 indent-10 float-left">
              <h3>Major Program</h3>
            </div>
            <div className="float-left indent-10">
              <button className="w-40 h-10 place-self-end text-white rounded-md bg-blue-500 hover:bg-blue-400">
                View Graph
              </button>
            </div>
          </div>
          <div className="h-5"></div>
          <div className="overflow-auto indent-10 max-h-60 w-1/2 bg-center bg-slate-200">
            {majorCourses.map((course) => (
              <li className="hover:bg-slate-300 list-none">
                <Course course={course} />
              </li>
            ))}
          </div>
        </>
      )}
      {minorCourses?.length > 0 && (
        <>
          <div className="h-10"></div>
          <div className="flow-root">
            <div className="text-zinc-600 indent-10 float-left">
              <h3>Minor Program</h3>
            </div>
            <div className="float-left indent-10">
              <button className="w-40 h-10 place-self-end text-white rounded-md bg-blue-500 hover:bg-blue-400">
                View Graph
              </button>
            </div>
          </div>
          <div className="h-5"></div>
          <div className="overflow-auto indent-10 max-h-60 w-1/2 bg-center bg-slate-200">
            {minorCourses.map((course) => (
              <li className="hover:bg-slate-300 list-none">
                <Course course={course} />
              </li>
            ))}
          </div>
        </>
      )}
      {areaCourses?.length > 0 && (
        <>
          <div className="h-10"></div>
          <div className="flow-root">
            <div className="text-zinc-600 indent-10 float-left">
              <h3>Area of Concentration</h3>
            </div>
            <div className="float-left indent-10">
              <button className="w-40 h-10 place-self-end text-white rounded-md bg-blue-500 hover:bg-blue-400">
                View Graph
              </button>
            </div>
          </div>
          <div className="h-5"></div>
          <div className="overflow-x-scroll max-h-60">
            {areaCourses.map((course) => (
              <li className="hover:bg-slate-300 list-none">
                <Course course={course} />
              </li>
            ))}
          </div>
        </>
      )} */}

      <CourseGraph edges={edges} nodes={nodes} />
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const programId = context.query.programId as string;
  const school = await getProgramSchool(programId);
  const program = await getProgram(programId);
  const courses = await getProgramPrerequisites(programId);
  const { nodes, edges } = createPrerequisiteGraph(courses);

  return {
    props: {
      program,
      school,
      nodes,
      edges,
    },
  };
};

export default Page;
