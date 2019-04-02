import { Client } from 'pg';
import { DB_URI } from './config';

const client = new Client({
    connectionString: DB_URI,
});

client.connect();

export default client;
