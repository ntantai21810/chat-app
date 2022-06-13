import { ConversationModel } from "../../domains/Conversation";
import { IConversationPresenter } from "../../presenter";

export interface IAddConversationRepo {
  addConversation(conversationModel: ConversationModel): void;
}

export default class AddConversationUseCase {
  private repository: IAddConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IAddConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  execute(conversationModel: ConversationModel) {
    this.repository.addConversation(conversationModel);

    this.presenter.addConversation(conversationModel);
  }
}
