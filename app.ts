import { Application, IBoot } from 'egg';
import { MongoClient } from 'mongodb';
import initDB from './db';

export default class Main implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready.
    try {
      const {
        mongo = 'mongodb://localhost:27017',
        dbinit = 'false',
        db = 'flash-card',
      } = JSON.parse(process?.argv?.[2]);
      this.app.client = new MongoClient(mongo);
      await this.app.client.connect();
      this.app.db = this.app.client.db(db);
      if (dbinit === 'true' || dbinit === true) {
        initDB(this.app.db);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.
  }

  async beforeClose() {
    // Do some thing before app close.
    this?.app?.client?.close();
  }
}
