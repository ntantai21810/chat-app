import { IConnectDatabaseRepo, IDisconnectDatabaseRepo } from "../../useCases";

export interface IDatabaseDataSource {
  connect(name: string, userId: string): Promise<void>;
  disconnect(): Promise<void>;
}
export class DatabaseRepository
  implements IConnectDatabaseRepo, IDisconnectDatabaseRepo
{
  private dataSource: IDatabaseDataSource;

  constructor(dataSource: IDatabaseDataSource) {
    this.dataSource = dataSource;
  }

  connect(name: string, userId: string): Promise<void> {
    return this.dataSource.connect(name, userId);
  }

  disconnect(): Promise<void> {
    return this.dataSource.disconnect();
  }
}
