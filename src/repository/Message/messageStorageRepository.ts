import {
  IMessage,
  IQueryOption,
  MessageModel,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";
import {
  IAddMessageRepo,
  IDeleteMessageRepo,
  IGetMessageRepo,
  IUpdateMessageRepo,
} from "../../useCases";

export interface IMessageStorageDataSouce {
  getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
  updateMessage(message: IMessage): void;
  deleteMessage(message: IMessage): void;
}

export class MessageStorageRepository
  implements
    IGetMessageRepo,
    IAddMessageRepo,
    IUpdateMessageRepo,
    IDeleteMessageRepo
{
  private dataSource: IMessageStorageDataSouce;

  constructor(dataSource: IMessageStorageDataSouce) {
    this.dataSource = dataSource;
  }

  async getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<MessageModel[]> {
    const res = await this.dataSource.getMessagesByConversation(
      conversationId,
      options
    );

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  addMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.addMessage(message);
  }

  updateMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.updateMessage(message);
  }

  deleteMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.deleteMessage(message);
  }
}