import {
  IMessage,
  MessageModel,
  MessageType,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";
import {
  IAddMessageRepo,
  IDeleteMessageRepo,
  IGetMessageRepo,
  ISearchMessageRepo,
  IUpdateMessageRepo,
} from "../../useCases";
import { IGetMessageTypeRepo } from "../../useCases/Message/getMessageTypeByConversationUseCase";

export interface IMessageStorageDataSouce {
  getMessagesByConversation(
    conversationId: string,
    fromMessage?: IMessage,
    toMessage?: IMessage,
    limit?: number,
    exceptBound?: boolean
  ): Promise<IMessage[]>;
  getMessagesTypeByConversation(
    conversationId: string,
    type: MessageType,
    fromMessage: IMessage,
    limit?: number
  ): Promise<IMessage[]>;
  addMessage(message: IMessage): Promise<void>;
  updateMessage(message: IMessage): Promise<void>;
  deleteMessage(message: IMessage): Promise<void>;
  searchMessage(text: string): Promise<IMessage[]>;
}

export class MessageStorageRepository
  implements
    IGetMessageRepo,
    IAddMessageRepo,
    IUpdateMessageRepo,
    IDeleteMessageRepo,
    ISearchMessageRepo,
    IGetMessageTypeRepo
{
  private dataSource: IMessageStorageDataSouce;

  constructor(dataSource: IMessageStorageDataSouce) {
    this.dataSource = dataSource;
  }

  async getMessagesByConversation(
    conversationId: string,
    fromMessageModel?: MessageModel,
    toMessageModel?: MessageModel,
    limit?: number,
    exceptBound?: boolean
  ): Promise<MessageModel[]> {
    const fromMessage = fromMessageModel
      ? normalizeMessageData(fromMessageModel)
      : undefined;
    const toMessage = toMessageModel
      ? normalizeMessageData(toMessageModel)
      : undefined;

    const res = await this.dataSource.getMessagesByConversation(
      conversationId,
      fromMessage,
      toMessage,
      limit,
      exceptBound
    );

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  addMessage(messageModel: MessageModel): Promise<void> {
    const message = normalizeMessageData(messageModel);

    return this.dataSource.addMessage(message);
  }

  updateMessage(messageModel: MessageModel): Promise<void> {
    const message = normalizeMessageData(messageModel);

    return this.dataSource.updateMessage(message);
  }

  deleteMessage(messageModel: MessageModel): Promise<void> {
    const message = normalizeMessageData(messageModel);

    return this.dataSource.deleteMessage(message);
  }

  async searchMessage(text: string): Promise<MessageModel[]> {
    const res = await this.dataSource.searchMessage(text);

    const filter = res.filter((item) => item !== undefined);

    const messageModels: MessageModel[] = [];

    for (let message of filter) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  async getMessagesTypeByConversation(
    conversationId: string,
    type: MessageType,
    fromMessageModel: MessageModel,
    limit?: number | undefined
  ): Promise<MessageModel[]> {
    const fromMessage = normalizeMessageData(fromMessageModel);

    const res = await this.dataSource.getMessagesTypeByConversation(
      conversationId,
      type,
      fromMessage,
      limit
    );

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }
}
