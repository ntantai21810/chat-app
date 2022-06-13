import { ConversationModel } from "../../domains/Conversation";
import { IConversationPresenter } from "../../presenter";

export interface IGetConversationRepo {
  getConversation(userId: string): Promise<ConversationModel | null>;
}

export default class GetConversationUseCase {
  private repository: IGetConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IGetConversationRepo,
    presenter?: IConversationPresenter
  ) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  async execute(userId: string) {
    const res = await this.repository.getConversation(userId);

    return res;
  }
}
