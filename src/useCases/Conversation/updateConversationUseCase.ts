import { ConversationModel } from "../../domains";
import { IConversationPresenter } from "../../presenter";

export interface IUpdateConversationRepo {
  updateConversation(conversationModel: ConversationModel): Promise<void>;
}

export class UpdateConversationUseCase {
  private repository: IUpdateConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IUpdateConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(conversationModel: ConversationModel) {
    try {
      await this.repository.updateConversation(conversationModel);

      this.presenter.updateConversation(conversationModel);
    } catch (e) {
      throw e;
    }
  }
}
