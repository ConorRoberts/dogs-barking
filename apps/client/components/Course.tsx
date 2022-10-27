import Link from "next/link";
import React from "react";

const Course = (props) => {
  const { course } = props;
  return (
    <div className="max-w-10">
      <Link href={`/course/${course.nodeId}`}>
        <div className="flex px-2 py-1 max-w-10">
          <p className="ml-1 text-slate-600">{course.id}</p>
          <p className="ml-1 text-slate-400">{course.name}</p>
          <p className="ml-1 text-slate-400">{course.weight}</p>
        </div>
      </Link>
    </div>
  );
};

export default Course;
