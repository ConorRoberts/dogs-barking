import { data } from "cypress/types/jquery";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets the previous ratings for a node (Course)
 * @param nodeId
 */
const getTopRated = async (school: string, count: string, ratingType: string, department: string, level: string, sortType: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const result = await session.run(
    `
        MATCH (s:School)
        WHERE s.abbrev = "${school}"
        MATCH (s)-[:OFFERS]->(c:Course)
        WHERE c.department = "${department}"
        AND toString(c.number) STARTS WITH "${level}"
        MATCH (c)-[:HAS_RATING]->(rating:Rating)
        WHERE rating.${ratingType} IS NOT NULL
        RETURN 
        c,
        rating.${ratingType} as ${ratingType}
        ORDER BY rating.${ratingType} ${sortType}
        LIMIT ${count}
    `,
  );

  await session.close();
  await driver.close();
  return result.records.map((e) => ({...e.get("c").properties, rating: e.get("difficulty") }));
};

export default getTopRated;
