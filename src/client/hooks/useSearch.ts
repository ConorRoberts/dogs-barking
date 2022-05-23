import axios from "axios";
import { useMemo, useState } from "react";

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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { type = "course" } = config ?? {};

  useMemo(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      // Fetch data from search endpoint
      if (query.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`/api/search/${type}`, {
        params: {
          query,
        },
      });

      setResults(data);
      setLoading(false);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [query, type]);

  return { results, loading };
};

export default useSearch;
