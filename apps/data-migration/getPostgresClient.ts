import { Client } from "pg";

/**
 * @returns An instance of a PG client connected to our Postgres DB
 */
const getPostgresClient = () => {
    const client = new Client({
        user: "postgres",
        password: "EMZqZiLsn4Nhnkr",
        port: 5432,
        host: "db-1.chkuvflzurau.us-east-1.rds.amazonaws.com",
    });

    return client;
};

export default getPostgresClient;
