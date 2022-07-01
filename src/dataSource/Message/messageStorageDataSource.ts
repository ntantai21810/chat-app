import { IMessage, IQueryOption } from "../../domains";
import { IMessageStorageDataSouce } from "../../repository";

export interface IMessageStorage {
  getMessagesByConversation: (
    conversationId: string,
    options?: IQueryOption
  ) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
  updateMessage: (message: IMessage) => void;
  deleteMessage: (message: IMessage) => void;
  searchMessage(text: string): Promise<IMessage[]>;
}

export class MessageStorageDataSource implements IMessageStorageDataSouce {
  private database: IMessageStorage;

  constructor(storage: IMessageStorage) {
    this.database = storage;
  }

  getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<IMessage[]> {
    return this.database.getMessagesByConversation(conversationId, options);
  }

  addMessage(message: IMessage): void {
    this.database.addMessage(message);
  }

  updateMessage(message: IMessage): void {
    this.database.updateMessage(message);
  }

  deleteMessage(message: IMessage): void {
    this.database.deleteMessage(message);
  }

  searchMessage(text: string): Promise<IMessage[]> {
    return this.database.searchMessage(text);
  }
}
