import Course from "@typedefs/Course";
import Link from "next/link";

interface Props {
  course: Course;
}
const CatalogCourse = ({ course }: Props) => {
  const { id, code } = course;
  return (
    <div className="py-2 dark:even:bg-gray-800">
      <Link href={`/course/${id}`} passHref>
        <div>
          <p className="font-semibold">
            {code} - {course.name}
          </p>
          <p>{course.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default CatalogCourse;
