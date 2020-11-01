import { DB_URI, DB_NAME } from './config';
import { MongoClient, Db } from 'mongodb';
let db: Promise<Db> = (async function() {
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  await client.connect();
  return client.db(DB_NAME);
})();

export default db;
