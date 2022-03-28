import CourseGraph from "@components/CourseGraph";
import Course from "@dogs-barking/common/types/Course";
import Program from "@dogs-barking/common/types/Program";
import School from "@dogs-barking/common/types/School";
import createPrerequisiteGraph from "@utils/createPrerequisiteGraph";
import getProgram from "@utils/getProgram";
import getProgramPrerequisites from "@utils/getProgramPrerequisites";
import getProgramRequireds from "@utils/getProgramRequireds";
import getProgramSchool from "@utils/getProgramSchool";
import axios from "axios";
import { NextPageContext } from "next";
import router from "next/router";
import React, { useState } from "react";
import { Edge, Node } from "react-flow-renderer";
import { useQuery } from "react-query";

interface PageProps {
  program: Program;
  school: School;
  nodes: Node<Course>[];
  edges: Edge[];
}

const unSelectedStyle = "w-40 h-20 text-white rounded-md bg-blue-500 hover:bg-blue-400";
const selectedStyle = "w-40 h-20 text-white rounded-md bg-blue-700 hover:bg-blue-600";

const Page = ({ program, school, nodes, edges }: PageProps) => {
  const [majorCourses, setMajorCourses] = useState(null);
  const [minorCourses, setMinorCourses] = useState(null);
  const [areaCourses, setAreaCourses] = useState(null);

  const [showMajor, setMajorVisible] = useState(false);
  const [showMinor, setMinorVisible] = useState(false);
  const [showAOC, setAOCVisible] = useState(false);

  const [selectedMajor, isMajor] = useState(false);
  const [selectedMinor, isMinor] = useState(false);
  const [selectedAOC, isAOC] = useState(false);
  
  useQuery("programs", async () => {
    try {
      const { data } = await axios.get(`/api/db/programs/${router.query.programId}`);
      setMajorCourses(data.major);
      setMinorCourses(data.minor);
      setAreaCourses(data.area);
      console.log("Working");
      if (majorCourses?.length > 0){
        isMajor(true);
        setMajorVisible(true);
      }
      else if (minorCourses?.length > 0){
        isMinor(true);
        setMinorVisible(true);
      }
      else if (areaCourses?.length > 0){
        isAOC(true);
        setAOCVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const toggleMajor = () => {
    setMinorVisible(false);
    isMinor(false);
    setAOCVisible(false);
    isAOC(false);
    if (showMajor == true){
      isMajor(false);
      setMajorVisible(false);
    }
    if (showMajor == false){
      isMajor(true);
      setMajorVisible(true);
    }
  };

  const toggleMinor = () => {
    setMajorVisible(false);
    isMajor(false);
    setAOCVisible(false);
    isAOC(false);
    if (showMinor == true){
      isMinor(false);
      setMinorVisible(false);
    }
    if (showMinor == false){
      isMinor(true);
      setMinorVisible(true);
    }
  };

  const toggleAOC = () => {
    setMajorVisible(false);
    isMajor(false);
    setMinorVisible(false);
    isMinor(false);
    if (showAOC == true){
      isAOC(false);
      setAOCVisible(false);
    }
    if (showAOC == false){
      isAOC(true);
      setAOCVisible(true);
    }
  };

  const Major = () => (   
    <CourseGraph edges={edges} nodes={nodes} />
  );
  const Minor = () => (   
    <h3 className="text-center text-slate-800">Displaying Minor</h3>
  );
  const AOC = () => (   
    <h3 className="text-center text-slate-800">Displaying AOC</h3>
  );
  
  return (
    <div>
      <h2 className="text-center text-slate-800">{program.name ?? program.id}</h2>
      <p className="text-center text-slate-800">{school.name}</p>
      <div></div>
      <div className="grid my-20 mx-52 grid-cols-3 place-items-center">

        {(majorCourses && majorCourses.length > 0) && 
          <button className={selectedMajor? selectedStyle : unSelectedStyle} onClick={toggleMajor}>
            Major
          </button>
        }

        {(minorCourses && minorCourses.length > 0) && 
          <button className={selectedMinor? selectedStyle : unSelectedStyle} onClick={toggleMinor}>
            Minor
          </button>
        }

        {(areaCourses && areaCourses.length > 0) && 
          <button className={selectedAOC? selectedStyle : unSelectedStyle} onClick={toggleAOC}>
            Area
          </button>
        }

      </div>
      { showMajor ? <Major /> : null }
      { showMinor ? <Minor /> : null }
      { showAOC ? <AOC /> : null }
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const programId = context.query.programId as string;
  const school = await getProgramSchool(programId);
  const program = await getProgram(programId);
  const requiredCourses = await getProgramRequireds(programId);
  const courses = await getProgramPrerequisites(programId);
  const { nodes, edges } = createPrerequisiteGraph(courses, requiredCourses);
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
