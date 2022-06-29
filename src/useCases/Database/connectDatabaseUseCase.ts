import { IDatabasePresenter } from "../../presenter";

export interface IConnectDatabaseRepo {
  connect(name: string, userId: string): Promise<void>;
}

export class ConnectDatabaseUseCase {
  private repository: IConnectDatabaseRepo;
  private presenter: IDatabasePresenter;

  constructor(repository: IConnectDatabaseRepo, presenter: IDatabasePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(name: string, userId: string) {
    try {
      await this.repository.connect(name, userId);

      this.presenter.setConnect(true);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
