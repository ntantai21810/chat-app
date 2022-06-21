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
    console.log("Get from cache");
    return new Promise((resolve, reject) => {
      if (memCache[conversationId]) {
        resolve(memCache[conversationId]);
      } else {
        reject();
      }
    });
  }

  public addMessage(message: IMessage): void {
    console.log("Add to cache");
    if (memCache[message.conversationId]) {
      memCache[message.conversationId].push(message);

      memCache[message.conversationId] =
        memCache[message.conversationId].slice(-10);
    } else {
      memCache[message.conversationId] = [message];
    }
  }
}
