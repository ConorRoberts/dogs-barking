import neo4j from "neo4j-driver";

const getNeo4jDriver = () => {
  return neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "test"));
};

export default getNeo4jDriver;
