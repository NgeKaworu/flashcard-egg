import 'egg';
import { Db, MongoClient } from 'mongodb';

declare module 'egg' {
  interface Application {
    db: Db;
    client: MongoClient;
  }
}
