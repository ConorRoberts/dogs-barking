import axios from "axios";
import { useEffect, useState } from "react";

export interface UseCourseSearchParams {
  courseId: string;
  description: string;
}

interface Config {
  type?: "course" | "program";
}

/**
 * Calls the API to get the course search results on update of the query params
 * @param params
 * @returns
 */
const useSearch = (query: string, config?: Config) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { type = "course" } = config ?? {};

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      // Fetch data from search endpoint
      if (query.length === 0) {
        setResults([]);
        return;
      }

      const { data } = await axios.get(`/api/search/${type}`, {
        params: {
          query,
        },
      });

      setResults(data);
    }, 50);

    setLoading(false);
    return () => {
      clearTimeout(timer);
    };
  }, [query, type]);

  return { results, loading };
};

export default useSearch;
