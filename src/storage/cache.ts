import { IMessageCache } from "../dataSource";
import { IMessage } from "../domains";

interface IMemCache {
  [conversationId: string]: IMessage[];
}

const memCache: IMemCache = {};

export class CacheStorage implements IMessageCache {
  private static instace: CacheStorage;

  public static getInstance() {
    if (!this.instace) this.instace = new CacheStorage();

    return this.instace;
  }

  public getMessagesByConversation(
    conversationId: string
  ): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      if (memCache[conversationId]) {
        resolve(memCache[conversationId]);
      } else {
        resolve([]);
      }
    });
  }

  public addMessage(message: IMessage): void {
    if (memCache[message.conversationId]) {
      memCache[message.conversationId].push(message);

      memCache[message.conversationId] =
        memCache[message.conversationId].slice(-10);
    } else {
      memCache[message.conversationId] = [message];
    }
  }

  updateMessage(message: IMessage): void {
    if (memCache[message.conversationId]) {
      memCache[message.conversationId] = memCache[message.conversationId].map(
        (m) => (m.id !== message.id ? m : message)
      );
    } else {
      memCache[message.conversationId] = [message];
    }
  }

  deleteMessage(message: IMessage): void {
    if (memCache[message.conversationId]) {
      memCache[message.conversationId] = memCache[
        message.conversationId
      ].filter((item) => item.id !== message.id);
    }
  }
}
