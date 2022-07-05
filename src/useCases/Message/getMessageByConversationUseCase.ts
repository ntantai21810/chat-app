import { MessageModel } from "../../domains";
import { IMessagePresenter } from "../../presenter";

export interface IGetMessageRepo {
  getMessagesByConversation(
    conversationId: string,
    fromMessage?: MessageModel,
    toMessage?: MessageModel,
    limit?: number,
    exceptBound?: boolean
  ): Promise<MessageModel[]>;
}

export class GetMessageByConversationUseCase {
  private repository: IGetMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IGetMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(
    conversationId: string,
    fromMessage?: MessageModel,
    toMessage?: MessageModel,
    limit?: number,
    exceptBound?: boolean
  ) {
    try {
      const res = await this.repository.getMessagesByConversation(
        conversationId,
        fromMessage,
        toMessage,
        limit,
        exceptBound
      );

      this.presenter.addMessages(res);

      return res;
    } catch (e) {
      throw e;
    }
  }
}
