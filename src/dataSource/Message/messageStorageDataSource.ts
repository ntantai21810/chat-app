import { IQueryOption } from "../../domains/common/helper";
import { IMessage } from "../../domains/Message";
import { IMessageStorageDataSouce } from "../../repository/Message/messageStorageRepository";

export interface IMessageStorage {
  getMessagesByConversation: (
    conversationId: string,
    options?: IQueryOption
  ) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
  updateMessage: (message: IMessage) => void;
  deleteMessage: (message: IMessage) => void;
}

export default class MessageStorageDataSource
  implements IMessageStorageDataSouce
{
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
}
