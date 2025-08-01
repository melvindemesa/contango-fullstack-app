import { Pool } from 'pg';

const postgresdb = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default postgresdb;
