import { IMessage } from "../../domains/Message";
import { IMessageDatabaseDataSouce } from "../../repository/Message/messageDatabaseRepository";

export interface IMessageDatabase {
  getMessagesByConversation: (conversationId: string) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
}

export default class MessageDatabaseDataSource
  implements IMessageDatabaseDataSouce
{
  private database: IMessageDatabase;

  constructor(storage: IMessageDatabase) {
    this.database = storage;
  }

  getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return this.database.getMessagesByConversation(conversationId);
  }

  addMessage(message: IMessage): void {
    this.database.addMessage(message);
  }
}
