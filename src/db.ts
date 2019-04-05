// Connects to a postgres database
import { Client } from 'pg';
import { DB_URI } from './config';

const db = new Client({
    connectionString: DB_URI,
});

db.connect();

export default db;
