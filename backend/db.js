import pg from 'pg'

const Pool = pg.Pool;
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    endpoint_id: process.env.ENDPOINT_ID,
    ssl: {
        rejectUnauthorized: false, // Use this if you have self-signed certificates
        // Other SSL options may be required depending on your PostgreSQL server setup
    }
});

export {pool};