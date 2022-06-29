import { IDatabaseDataSource } from "../../repository";

export interface IDatabase {
  connect(name: string, userId: string): Promise<void>;
}

export class DatabaseDataSource implements IDatabaseDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  connect(name: string, userId: string): Promise<void> {
    return this.database.connect(name, userId);
  }
}
