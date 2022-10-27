import Link from "next/link";
import { FC } from "react";
import Course from "~/types/Course";
import Program from "~/types/Program";

interface Props {
  data: Course | Program;
  type: "course" | "program";
}

const SearchModalSearchResult: FC<Props> = ({ data, type }) => {
  return (
    <Link
      href={`/${type}/${data.id}`}
      key={data.id}
      className="px-4 py-0.5 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer duration-75 text-lg flex justify-between gap-8 sm:gap-16"
      id={`search-modal-result-${type === "course" ? (data as Course).code : (data as Program).short}`}
    >
      <p>{type === "course" ? (data as Course).code : (data as Program).short}</p>
      <p className="truncate">{data.name}</p>
    </Link>
  );
};

export default SearchModalSearchResult;
