import { useEffect, useState } from "react";
import { MeiliSearch } from "meilisearch";

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
        host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
        apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY,
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
