import Program from "~/types/Program";
import Course from "~/types/Course";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  return useQuery(
    ["search", type, query],
    async ({ signal }) => {
      // Cancel any existing queries because we are about to make a new one
      await queryClient.cancelQueries(["search", type]);

      if (query.length === 0) {
        return [];
      }

      const { data } = await axios.get<(Course | Program)[]>(`/api/search/${type}?query=${query}`, { signal });

      return data;
    },
    {}
  );
};

export default useSearch;
