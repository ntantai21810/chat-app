import { ConversationModel } from "../../domains";
import { IConversationPresenter } from "../../presenter";

export interface IUpdateConversationRepo {
  updateConversation(conversationModel: ConversationModel): void;
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

  execute(conversationModel: ConversationModel) {
    try {
      this.repository.updateConversation(conversationModel);

      this.presenter.updateConversation(conversationModel);
    } catch (e) {
      throw e;
    }
  }
}
