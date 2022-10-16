import Program from "~/types/Program";
import Course from "~/types/Course";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface UseCourseSearchParams {
  courseId: string;
  description: string;
}

interface Config {
  type?: "course" | "program";
}

/**
 * Calls the API to get the course search results on update of the query params
 */
const useSearch = (query: string, config?: Config) => {
  const { type = "course" } = config ?? {};

  return useQuery(["search", type, query], async () => {
    if (query.length === 0) {
      return [];
    }

    const { data } = await axios.get<(Course | Program)[]>(`/api/search/${type}?query=${query}`);

    return data;
  });
};

export default useSearch;
