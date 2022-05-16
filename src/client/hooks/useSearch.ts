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
 */
const useSearch = (query: string, config?: Config) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { type = "course" } = config ?? {};

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (loading) return;
      
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
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [query, type]);

  return { results, loading };
};

export default useSearch;
