import React, { useState } from "react";

const params = {
  departmentCode: {name: "departmentCode", type: "string", description: "Letter code of deparment", example: "CIS", required: true},
  courseNumber: {name: "courseNumber", type: "number", description: "The numerical code for the course", example: "1300", required: true},
  courseName: {name: "courseName", type: "string", description: "The name of the course", example: "Intro to Programming", required: true},
  description: {name: "description", type: "string", description: "The description/details of the course", example: "This is an example description", required: true},
  semestersOffered: {name: "SemestersOffered", type: "S | F | W", description: "A list of semester offerings for the course", example: "[S, F, W]", required: true},
  yearsOffered: {name: "yearsOffered", type: "All | Odd | Even", description: "Years that the course is offered. Odd for odd years only, Even for even years, All for both", example: "Odd", required: true},
  creditWeight: {name: "creditWeight", type: "number", description: "The weight of the course (multiples of 0.25 for Guelph)", example: "0.25", required: true},
  prerequisites: {name: "prerequisites", type: "string[]", description: "A List of Prerequisites for the course", example: "[CIS2750, CIS3750]", required: true},
  associatedDepartments: {name: "associatedDepartments", type: "string[]", description: "Departments that the course is associated with.", example: "[CIS, ENGG]", required: true},
  restrictions: {name: "restrictions", type: "string[]", description: "Letter code of deparment", example: "[CIS2750, CIS3750]", required: true},
  corequisites: {name: "corequisites", type: "string[]", description: "Letter code of deparment", example: "[CIS2750, CIS3750]", required: true},
  equates: {name: "equates", type: "string[]", description: "Letter code of deparment", example: "[CIS2750, CIS3750]", required: true},
};

const style = "ml-2 text-sky-600 hover:text-sky-800";

const Page = () => {
  const [param, setParam] = useState(null);
  return (
    <div>
      <div>
        <h3 className="text-center">The Course Object</h3>
      </div>
      <div className="px-10 py-5 flex flex-col justify-center items-center">
        <h4>Sample Object</h4>
        <p>Click on a parameter to see more details</p>
        <pre className="flex flex-col justify-center">
          <code className="language-ts flex flex-col justify-center">
            <b>Course</b>
            {"{"}
            <span className={style} onClick={()=>setParam(params["departmentCode"])}>departmentCode: string;</span>
            <span className={style} onClick={()=>setParam(params["courseNumber"])}>courseNumber: number;</span>
            <span className={style} onClick={()=>setParam(params["courseName"])}>courseName: string;</span>
            <span className={style} onClick={()=>setParam(params["description"])}>description: string;</span>
            <span className={style} onClick={()=>setParam(params["semestersOffered"])}>semestersOffered: SemestersOffered[];</span>
            <span className={style} onClick={()=>setParam(params["yearsOffered"])}>yearsOffered: YearsOffered;</span>
            <span className={style} onClick={()=>setParam(params["creditWeight"])}>creditWeight: number;</span>
            <span className={style} onClick={()=>setParam(params["prerequisites"])}>prerequisites: string[];</span>
            <span className={style} onClick={()=>setParam(params["associatedDepartments"])}>associatedDepartments: string[];</span>
            <span className={style} onClick={()=>setParam(params["restrictions"])}>restrictions: string;</span>
            <span className={style} onClick={()=>setParam(params["corequisites"])}>corequisites: string[];</span>
            <span className={style} onClick={()=>setParam(params["equates"])}>equates: string[];</span>
            <span className={style}>lecturesPerWeek?: number;</span>
            <span className={style}>labsPerWeek: number;</span>
            <span className={style}>locations: string</span>
            {"}"}
          </code>
        </pre>
      </div>
      <div className="flex flex-col justify-center items-center py-5 px-10">
        {param &&
        <div className="">
          <h4>Object Parameters: In Depth</h4>
          <p>Property Name: <i>{param.name}</i></p>
          <p>Type: <i>{param.type}</i></p>
          <p>Description: <i>{param.description}</i></p>
          <p>Example: <i>{param.example}</i></p>
          <p>Required: <i>{param.required? "Yes" : "No"}</i></p>
        </div>
        }
      </div>
    </div>
  );
};

export default Page;