import { IMessage } from "../../domains/Message";
import { IMessageDatabaseDataSouce } from "../../repository/Message/messageDatabaseRepository";

export interface IMessageCache {
  getMessagesByConversation: (conversationId: string) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
}

export default class MessageCacheDataSource
  implements IMessageDatabaseDataSouce
{
  private cache: IMessageCache;

  constructor(storage: IMessageCache) {
    this.cache = storage;
  }

  getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return this.cache.getMessagesByConversation(conversationId);
  }

  addMessage(message: IMessage): void {
    this.cache.addMessage(message);
  }
}
