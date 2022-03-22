import neo4j from "neo4j-driver";
const getNeo4jDriver = () => {
  return neo4j.driver("neo4j://100.24.23.121/", neo4j.auth.basic("neo4j", "th3yd0b3b4rk1ng"));
};

export default getNeo4jDriver;
