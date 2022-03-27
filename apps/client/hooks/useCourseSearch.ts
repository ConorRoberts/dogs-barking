import axios from "axios";
import { useEffect, useState } from "react";

export interface UseCourseSearchParams {
  courseId: string;
  description: string;
}

/**
 * Calls the API to get the course search results on update of the query params
 * @param params
 * @returns
 */
const useCourseSearch = (query: string) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      // Fetch data from search endpoint
      if (query.length === 0) {
        setResults([]);
        return;
      }

      const { data } = await axios.get(`/api/course/search`, {
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
  }, [query]);

  return { results, loading };
};

export default useCourseSearch;
