import { IMessage } from "../../domains/Message";
import { IMessageStorageDataSouce } from "../../repository/Message/messageStorageRepository";

export interface IMessageCache {
  getMessagesByConversation: (conversationId: string) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
  updateMessage: (message: IMessage) => void;
  deleteMessage: (message: IMessage) => void;
}

export default class MessageCacheDataSource
  implements IMessageStorageDataSouce
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

  updateMessage(message: IMessage): void {
    this.cache.updateMessage(message);
  }

  deleteMessage(message: IMessage): void {
    this.cache.deleteMessage(message);
  }
}
