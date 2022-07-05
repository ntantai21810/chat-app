import { IDatabaseDataSource } from "../../repository";
import { IDatabase } from "../../storage";

export class DatabaseDataSource implements IDatabaseDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  connect(name: string, userId: string): Promise<void> {
    return this.database.connect(name, userId);
  }

  disconnect(): Promise<void> {
    return this.database.disconnect();
  }
}
