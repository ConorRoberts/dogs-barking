import React from "react";

const CourseCardList = (props) => {
  const { courses } = props;

  return (
    <ul className="flex-auto max-h-96 justify-center w-full overflow-auto">
      {courses.map((course) => (
        <li className="flex justify-center" key={Math.random()}>
          {course}
        </li>
      ))}
    </ul>
  );
};
export default CourseCardList;
