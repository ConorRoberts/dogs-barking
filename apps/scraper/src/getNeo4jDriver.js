const neo4j = require("neo4j-driver");

const getNeo4jDriver = () => {
  return neo4j.driver(`bolt://${process.env.NEO4J_HOST}:7687`, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
};

module.exports = getNeo4jDriver;
