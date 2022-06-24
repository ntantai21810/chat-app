import { IMessageCache } from "../dataSource/Message/messageCacheDataSource";
import { IMessage } from "../domains/Message";

interface IMemCache {
  [conversationId: string]: IMessage[];
}

const memCache: IMemCache = {};

export default class Cache implements IMessageCache {
  private static instace: Cache;

  public static getInstance() {
    if (!this.instace) this.instace = new Cache();

    return this.instace;
  }

  public getMessagesByConversation(
    conversationId: string
  ): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      if (memCache[conversationId]) {
        resolve(memCache[conversationId]);
      } else {
        reject();
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
