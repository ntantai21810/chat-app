import { ConversationModel } from "../../domains/Conversation";
import { IConversationPresenter } from "../../presenter";

export interface IGetAllConversationRepo {
  getAllConversations(): Promise<ConversationModel[]>;
}

export default class GetAllConversationUseCase {
  private repository: IGetAllConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IGetAllConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    this.presenter.setLoading(true);

    try {
      const res = await this.repository.getAllConversations();

      this.presenter.setConversations(res);
    } catch (e) {
      console.log(e);
    }

    this.presenter.setLoading(false);
  }
}
