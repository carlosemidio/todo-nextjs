import { MongoClient, Db } from "mongodb";

let cachedDb: Db = null;

export default async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = "tododb";
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}
