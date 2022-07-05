import { IFile, IMessage, MessageType } from "../../domains";
import { IMessageStorageDataSouce } from "../../repository";
import { ICache } from "../../storage";

export interface IMessageCache {
  getMessagesByConversation: (conversationId: string) => Promise<IMessage[]>;
  addMessage: (message: IMessage) => void;
  updateMessage: (message: IMessage) => void;
  deleteMessage: (message: IMessage) => void;
  searchMessage: (text: string) => Promise<IMessage[]>;
}

export class MessageCacheDataSource implements IMessageStorageDataSouce {
  private cache: ICache;

  constructor(storage: ICache) {
    this.cache = storage;
  }

  getMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return this.cache.getByKey(conversationId);
  }

  addMessage(message: IMessage): void {
    this.cache.add(message.conversationId, message);
  }

  updateMessage(message: IMessage): void {
    this.cache.update(message.conversationId, message);
  }

  deleteMessage(message: IMessage): void {
    this.cache.delete(message.conversationId, message);
  }

  async searchMessage(text: string): Promise<IMessage[]> {
    const memCache = await this.cache.get();

    const messages: IMessage[] = [];

    for (let key in memCache) {
      for (let message of memCache[key]) {
        if (
          message.type === MessageType.TEXT &&
          (message.content as string).includes(text)
        ) {
          messages.push(message);
        } else if (message.type === MessageType.FILE) {
          for (let file of message.content as IFile[]) {
            if (file.name.includes(text)) messages.push(message);
          }
        }
      }
    }

    return messages;
  }
}
