import Course from "@components/Course";
import getProgram from "@utils/getProgram";
import getProgramSchool from "@utils/getProgramSchool";
import axios from "axios";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";

const Page = () => {
  const [programData, setProgramData] = useState(null);
  const [majorCourses, setMajorCourses] = useState(null);
  const [minorCourses, setMinorCourses] = useState(null);
  const [areaCourses, setAreaCourses] = useState(null);
  const router = useRouter();

  useQuery("programs", async () => {
    try {
      const { data } = await axios.get(`/api/db/programs/${router.query.programId}`);
      
      setProgramData(data.program);
      setMajorCourses(data.major);
      setMinorCourses(data.minor);
      setAreaCourses(data.area);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div>
      <h2 className="text-center text-slate-800">Program Overview</h2>
      {programData && (
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
      )}
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const programId = context.query.programId as string;
  const school = await getProgramSchool(programId);
  const program = await getProgram(programId);
  //const { nodes, edges } = await createProgramGraph(programId);

  return {
    props: {
      program,
      school,
      //nodes,
      //edges,
    },
  };
};

export default Page;
