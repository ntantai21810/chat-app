import { MessageModel } from "../../domains";
import { MessageType } from "./../../domains/Message/IMessage";

export interface IGetMessageTypeRepo {
  getMessagesTypeByConversation(
    conversationId: string,
    type: MessageType,
    fromMessageModel: MessageModel,
    limit?: number
  ): Promise<MessageModel[]>;
}

export class GetMessageTypeByConversationUseCase {
  private repository: IGetMessageTypeRepo;

  constructor(repository: IGetMessageTypeRepo) {
    this.repository = repository;
  }

  async execute(
    conversationId: string,
    type: MessageType,
    fromMessageModel: MessageModel,
    limit?: number
  ) {
    try {
      const res = await this.repository.getMessagesTypeByConversation(
        conversationId,
        type,
        fromMessageModel,
        limit
      );

      return res;
    } catch (e) {
      throw e;
    }
  }
}
