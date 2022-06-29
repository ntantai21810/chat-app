import { ISocketPresenter } from "../../presenter";

export interface IDisconnectSocketRepo {
  disconnect(): void;
}

export class DisconnectSocketUseCase {
  private repository: IDisconnectSocketRepo;
  private presenter: ISocketPresenter;

  constructor(repository: IDisconnectSocketRepo, presenter: ISocketPresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    try {
      this.repository.disconnect();
      this.presenter.setConnect(false);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
