import { IFile } from "./../domains/common/helper";
import { IMessageCache } from "../dataSource";
import { IMessage, MessageType } from "../domains";

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

  searchMessage(text: string): Promise<IMessage[]> {
    return new Promise((resolve) => {
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

      resolve(messages);
    });
  }
}
