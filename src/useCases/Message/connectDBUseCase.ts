import { IMessagePresenter } from "../../presenter";

export interface IConnectDBMessageRepo {
  connect(name: string, userId: string): Promise<any>;
}

export default class ConnectDBMessageUseCase {
  private repository: IConnectDBMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IConnectDBMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(name: string, userId: string) {
    try {
      await this.repository.connect(name, userId);

      this.presenter.setDBLoaded(true);
    } catch (e) {
      console.log(e);
    }
  }
}
