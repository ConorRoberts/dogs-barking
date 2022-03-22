import React from "react";

/**
 *
 * @param props
 * @returns
 */
const CourseCardList = (props) => {
  const { courses, isEditing } = props;
  const { courseChips } = courses;

  return (
    <ul className="flex-auto max-h-96 justify-end w-full overflow-auto">
      {courseChips.map((courseChip) => {
        <li className="flex justify-end" key={Math.random().toString()}>
          {courseChip}
        </li>;
      })}
    </ul>
  );
};

export default CourseCardList;
