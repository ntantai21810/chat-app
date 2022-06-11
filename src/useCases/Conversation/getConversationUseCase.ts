import { ConversationModel } from "../../domains/Conversation";
import { IConversationPresenter } from "../../presenter";

export interface IGetConversationRepo {
  getConversations(): Promise<ConversationModel[]>;
}

export default class GetConversationUseCase {
  private repository: IGetConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IGetConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    this.presenter.setLoading(true);

    try {
      const res = await this.repository.getConversations();

      this.presenter.setConversations(res);
    } catch (e) {
      console.log(e);
    }

    this.presenter.setLoading(false);
  }
}
