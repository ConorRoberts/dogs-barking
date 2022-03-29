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

const unSelectedStyle = "w-40 h-20 text-white rounded-md bg-blue-500 hover:bg-blue-400";
const selectedStyle = "w-40 h-20 text-white rounded-md bg-blue-700 hover:bg-blue-600";

const Page = ({ program, school, major, minor, area }: PageProps) => {
  const [majorCourses, setMajorCourses] = useState(null);
  const [minorCourses, setMinorCourses] = useState(null);
  const [areaCourses, setAreaCourses] = useState(null);

  const [showMajor, setMajorVisible] = useState(false);
  const [showMinor, setMinorVisible] = useState(false);
  const [showAOC, setAOCVisible] = useState(false);

  const [selectedMajor, isMajor] = useState(false);
  const [selectedMinor, isMinor] = useState(false);
  const [selectedAOC, isAOC] = useState(false);
  
  useQuery("programs", () => {
    axios.get(`/api/program/${router.query.programId}/major`)
      .then((res) => setMajorCourses(res.data.major))
      .catch((err) => console.log(err));

    axios.get(`/api/program/${router.query.programId}/minor`)
      .then((res) => setMinorCourses(res.data.minor))
      .catch((err) => console.log(err));

    axios.get(`/api/program/${router.query.programId}/area`)
      .then((res) => setAreaCourses(res.data.area))
      .catch((err) => console.log(err));

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
      {showMajor && 
        <CourseGraph edges={major.edges} nodes={major.nodes} />
      }
      { showMinor && 
        <CourseGraph edges={minor.edges} nodes={minor.nodes} />
      }
      { showAOC && 
        <CourseGraph edges={area.edges} nodes={area.nodes} /> 
      }
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const programId = context.query.programId as string;
  const school = await getProgramSchool(programId);
  const program = await getProgram(programId);

  const major = {nodes: [], edges: []};
  const minor = {nodes: [], edges: []};
  const area = {nodes: [], edges: []};

  // grabs data for majors
  const requiredCourses_major = await getProgramRequireds(programId, "major");
  const courses_major = await getProgramPrerequisites(programId, "major");
  const { nodes:major_nodes , edges:major_edges } = createPrerequisiteGraph(courses_major, requiredCourses_major);

  // grabs data for minors
  const requiredCourses_minor = await getProgramRequireds(programId, "minor");
  const courses_minor = await getProgramPrerequisites(programId, "minor");
  const { nodes:minor_nodes , edges:minor_edges } = createPrerequisiteGraph(courses_minor, requiredCourses_minor);
  
  // grabs data for AOC
  const requiredCourses_area = await getProgramRequireds(programId, "area");
  const courses_area = await getProgramPrerequisites(programId, "area");
  const { nodes:area_nodes , edges:area_edges } = createPrerequisiteGraph(courses_area, requiredCourses_area);
  
  // set all data points
  major.nodes = major_nodes;
  major.edges = major_edges;

  minor.nodes = minor_nodes;
  minor.edges = minor_edges;

  area.nodes = area_nodes;
  area.edges = area_edges;
  
  return {
    props: {
      program,
      school,
      major,
      minor,
      area,
    },
  };
};


export default Page;
