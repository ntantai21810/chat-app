import { IConnectDatabaseRepo } from "../../useCases/Database";

export interface IDatabaseDataSource {
  connect(name: string, userId: string): Promise<void>;
}
export class DatabaseRepository implements IConnectDatabaseRepo {
  private dataSource: IDatabaseDataSource;

  constructor(dataSource: IDatabaseDataSource) {
    this.dataSource = dataSource;
  }

  connect(name: string, userId: string): Promise<void> {
    return this.dataSource.connect(name, userId);
  }
}
