import { ConversationModel } from "../../domains/Conversation";
import { IConversationPresenter } from "../../presenter";

export interface IUpdateConversationRepo {
  updateConversation(conversationModel: ConversationModel): void;
}

export default class UpdateConversationUseCase {
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
    this.repository.updateConversation(conversationModel);

    this.presenter.updateConversation(conversationModel);
  }
}
