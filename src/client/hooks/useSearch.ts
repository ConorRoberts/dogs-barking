import { useEffect, useState } from "react";
import { MEILISEARCH_KEY, MEILISEARCH_HOST } from "@config/config";
import Program from "@typedefs/Program";
import Course from "@typedefs/Course";
import MeiliSearch from "meilisearch";

export interface UseCourseSearchParams {
  courseId: string;
  description: string;
}

interface Config {
  type?: "course" | "program";
}

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_KEY,
});

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

        const index = client.index(`${type}s`);

        const { hits } = await index.search(query);

        setResults(hits as (Course | Program)[]);
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
