import { IQueryOption, MessageModel } from "../../domains";
import { IMessagePresenter } from "../../presenter";

export interface IGetMessageRepo {
  getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<MessageModel[]>;
}

export class GetMessageByConversationUseCase {
  private repository: IGetMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IGetMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(conversationId: string, options?: IQueryOption) {
    try {
      const res = await this.repository.getMessagesByConversation(
        conversationId,
        options
      );

      this.presenter.addMessages(res);

      return res;
    } catch (e) {
      throw e;
    }
  }
}
