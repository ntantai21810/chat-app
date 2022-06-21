import { IMessage } from "../../domains/Message";
import { IMessageDatabaseDataSouce } from "../../repository/Message/messageDatabaseRepository";

export interface IMessageStorage {
  getMessagesByConversation: (conversationId: string) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
}

export default class MessageStorageDataSource
  implements IMessageDatabaseDataSouce
{
  private database: IMessageStorage;

  constructor(storage: IMessageStorage) {
    this.database = storage;
  }

  getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return this.database.getMessagesByConversation(conversationId);
  }

  addMessage(message: IMessage): void {
    this.database.addMessage(message);
  }
}
