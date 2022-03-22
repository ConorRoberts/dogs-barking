import React from "react";

const CourseCardList = (props) =>{
  const courses = props.courses;

  const courseList = courses.map((course) => {
    const cKey : string  = Math.random().toString();
    <li className="flex justify-center" key={cKey}>{course}</li>;
  });

  return(
    <ul className="flex-auto max-h-96 justify-center w-full overflow-auto">{courseList}</ul>
  );
};

export default CourseCardList;