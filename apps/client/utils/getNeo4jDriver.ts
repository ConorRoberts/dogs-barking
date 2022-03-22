import neo4j from "neo4j-driver";

const getNeo4jDriver = () => {
  return neo4j.driver(
    process.env.NEO4J_HOST,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );
};

export default getNeo4jDriver;
