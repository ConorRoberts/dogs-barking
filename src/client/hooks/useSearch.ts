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
    // Fetch data from search endpoint

    (async () => {
      try {
        setLoading(true);

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
