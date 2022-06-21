import { MessageModel } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";

export interface IGetMessageRepo {
  getMessagesByConversation(conversationId: string): Promise<MessageModel[]>;
}

export default class GetMessageByConversationUseCase {
  private repository: IGetMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IGetMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(conversationId: string) {
    try {
      const res = await this.repository.getMessagesByConversation(
        conversationId
      );

      this.presenter.setMessages(res);

      return res;
    } catch (e) {
      return null;
    }
  }
}
