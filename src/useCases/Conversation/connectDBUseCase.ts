import { IConversationPresenter } from "../../presenter";

export interface IConnectDBConversationRepo {
  connect(name: string, userId: string): Promise<any>;
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

  async execute(name: string, userId: string) {
    try {
      await this.repository.connect(name, userId);

      this.presenter.setDBLoaded(true);
    } catch (e) {
      console.log(e);
    }
  }
}
