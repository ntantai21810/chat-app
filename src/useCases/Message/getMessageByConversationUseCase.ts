import { IPaginate, IQueryOption } from "../../domains/common/helper";
import { MessageModel } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";

export interface IGetMessageRepo {
  getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<MessageModel[]>;
}

export default class GetMessageByConversationUseCase {
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
      return null;
    }
  }
}
