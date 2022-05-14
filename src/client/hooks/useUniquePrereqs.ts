import axios from "axios";
import { useEffect, useState } from "react";

export interface UseUniquePrereqsParams {
  nodeId: string;
}

/**
 * Calls the API to get the course search results on update of the query params
 * @param params
 * @returns
 */
const useUniquePrereqs = (query: string) => {
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

      const { data } = await axios.get(`/api/course/prerequisites`, {
        params: {
          id: query,
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

export default useUniquePrereqs;
