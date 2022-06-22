import { ISocketPresenter } from "../../presenter";

export interface IConnectSocketRepo {
  connect(userId: string, accessToken: string): void;
}

export default class ConnectSocketUseCase {
  private repository: IConnectSocketRepo;
  private presenter: ISocketPresenter;

  constructor(repository: IConnectSocketRepo, presenter: ISocketPresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(userId: string, accessToken: string) {
    try {
      this.repository.connect(userId, accessToken);
      this.presenter.setConnect(true);
    } catch (e) {
      console.log(e);
    }
  }
}
