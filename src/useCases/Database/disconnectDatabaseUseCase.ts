import { IDatabasePresenter } from "../../presenter";

export interface IDisconnectDatabaseRepo {
  disconnect(): Promise<void>;
}

export class DisconnectDatabaseUseCase {
  private repository: IDisconnectDatabaseRepo;
  private presenter: IDatabasePresenter;

  constructor(
    repository: IDisconnectDatabaseRepo,
    presenter: IDatabasePresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    try {
      await this.repository.disconnect();

      this.presenter.setConnect(false);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
