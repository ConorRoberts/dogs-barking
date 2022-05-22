import Course from "@typedefs/Course";
import Link from "next/link";

interface Props {
  course: Course;
}
const CatalogCourse = ({ course }: Props) => {
  const { id, code } = course;
  return (
    <div className="py-2 dark:even:bg-gray-800">
      <li>
        <Link href={`/course/${id}`} passHref>
          <div>
            <p className="">{code}</p>
          </div>
        </Link>
      </li>
    </div>
  );
};

export default CatalogCourse;
