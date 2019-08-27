// // Connects to a postgres database
// import { Client } from 'pg';

// const db: Client = new Client({
  //   connectionString: DB_URI,
  // });
  
  // db.connect();
  
  // export default db;
  
import { DB_URI, DB_NAME } from './config';
import { MongoClient, Db } from 'mongodb';
let db: Promise<Db> = (async function() {
  const client = new MongoClient(DB_URI, { useNewUrlParser: true });

  await client.connect();
  return client.db(DB_NAME);
})()

export default db;