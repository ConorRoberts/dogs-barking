import { useEffect, useState } from "react";
import { MeiliSearch } from "meilisearch";
import { MEILISEARCH_HOST, MEILISEARCH_KEY } from "@config/config";

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
      const client = new MeiliSearch({
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_KEY,
      });

      try {
        setLoading(true);

        if (query.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        const index = client.index(type + "s");

        const { hits } = await index.search(query);

        setResults(hits);
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
