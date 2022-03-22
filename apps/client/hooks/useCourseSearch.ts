import axios from "axios";
import { useEffect, useState } from "react";

export interface UseCourseSearchParams {
  courseId: string;
}

/**
 * Calls the API to get the course search results on update of the query params
 * @param params
 * @returns
 */
const useCourseSearch = (params: UseCourseSearchParams) => {
  const [results, setResults] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      // Fetch data from search endpoint
      if (params.courseId.length === 0) {
        setResults([]);
        return;
      }
      
      const { data } = await axios.get(`/api/course/search?courseId=${params.courseId}`);
      
      setResults(data);
    }, 50);
    
    setLoading(false);
    return () => {
      clearTimeout(timer);
    };
  }, [params.courseId]);

  return {results,loading};
};

export default useCourseSearch;
