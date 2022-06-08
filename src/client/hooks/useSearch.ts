import { useEffect, useState } from "react";
import Program from "@typedefs/Program";
import Course from "@typedefs/Course";
import MeiliSearch from "meilisearch";
import axios from "axios";

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
  const [results, setResults] = useState<(Course | Program)[]>([]);
  const [loading, setLoading] = useState(false);

  const { type = "course" } = config ?? {};

  useEffect(() => {
    // Fetch data from search endpoint
    if (query.length === 0) {
      return setResults([]);
    }

    (async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`/api/search/${type}`, { params: { query } });

        setResults(data as (Course | Program)[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, type]);

  return { results, loading };
};

export default useSearch;
