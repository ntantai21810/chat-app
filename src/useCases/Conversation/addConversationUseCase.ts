import { ConversationModel } from "../../domains";
import { IConversationPresenter } from "../../presenter";

export interface IAddConversationRepo {
  addConversation(conversationModel: ConversationModel): Promise<void>;
}

export class AddConversationUseCase {
  private repository: IAddConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IAddConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(conversationModel: ConversationModel) {
    try {
      await this.repository.addConversation(conversationModel);

      this.presenter.addConversation(conversationModel);
    } catch (e) {
      throw e;
    }
  }
}
