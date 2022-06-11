import { IConversationPresenter } from "../../presenter";

export interface IConnectDBConversationRepo {
  connect(): Promise<boolean>;
}

export default class ConnectDBConversationUseCase {
  private repository: IConnectDBConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IConnectDBConversationRepo,
    presenter: IConversationPresenter
  ) {
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
