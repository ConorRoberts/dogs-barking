import React, { useState } from "react";

const params = {
  title: {name: "title", type: "string", description: "The name/title of the program", example: "CS/CS:C", required: false},
  school: {name: "school", type: "UofG | UofT", description: "The school the program is offered at", example: "UofG for Guelph, UofT for Toronto", required: false},
  major: {name: "major", type: "Course[]", description: "A list of courses required to complete a program's major", example: "[22.00 Credits in CIS] For CS", required: false},
  minor: {name: "minor", type: "Course[]", description: "The list of courses required to complete a program's minor", example: "[ACCT1220, ECON1050, MGMT3020] for a business minor", required: false},
  area: {name: "area", type: "Course[]", description: "The list of courses required for a program's area of concentration.", example: "[CIS4020, CIS3700] for data science/ai stream", required: false},
  restricted: {name: "restricted", type: "Course[]", description: "Courses restricted to/from the program", example: "[ENGG2410]", required: false},
  programCode: {name: "programCode", type: "string", description: "A 3 or 4 Letter program code, with :C as an option for coop (guelph only)", example: "BME", required: false},
};

const style = "ml-2 text-sky-600 hover:text-sky-800";
const selected = "ml-2 text-slate-400 hover:text-slate-600";

const page = () => {
  const [param, setParam] = useState(null);
  return (
    <div>
      <div>
        <h3 className="text-center">The Program Object</h3>
      </div>
      <div className="px-10 py-5 flex flex-col justify-center items-center">
        <h4>Sample Object</h4>
        <p>Click on a parameter to see more details</p>
        <pre className="flex flex-col justify-center">
          <code className="language-ts flex flex-col justify-center">
            <b>Course</b>
            {"{"}
            <span className={style} onClick={()=>setParam(params["title"])}>title: string;</span>
            <span className={style} onClick={()=>setParam(params["school"])}>school: School;</span>
            <span className={style} onClick={()=>setParam(params["major"])}>major: Course[];</span>
            <span className={style} onClick={()=>setParam(params["minor"])}>minor: Course[];</span>
            <span className={style} onClick={()=>setParam(params["area"])}>area: Course[];</span>
            <span className={style} onClick={()=>setParam(params["restricted"])}>restricted: Course[];</span>
            <span className={style} onClick={()=>setParam(params["programCode"])}>programCode: string;</span>
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
export default page;