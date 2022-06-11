import { IMessagePresenter } from "../../presenter";

export interface IConnectDBMessageRepo {
  connect(): Promise<boolean>;
}

export default class ConnectDBMessageUseCase {
  private repository: IConnectDBMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IConnectDBMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    try {
      await this.repository.connect();

      this.presenter.setDBLoaded(true);
    } catch (e) {
      console.log(e);
    }
  }
}
