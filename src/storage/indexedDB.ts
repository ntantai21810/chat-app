import { IConversation } from "../domains/Conversation";
import { IMessage } from "../domains/Message";
import {
  IConversationIndexedDBStorage,
  IMessageIndexedDBStorage,
} from "./IStorage";

export default class IndexedDB
  implements IConversationIndexedDBStorage, IMessageIndexedDBStorage
{
  private static instace: IndexedDB;
  private db: IDBDatabase;
  private name: string;

  private constructor(name: string) {
    if (!window.indexedDB) {
      console.log(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );

      throw "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.";
    }

    this.name = name;
  }

  public static getInstance() {
    if (!this.instace) {
      this.instace = new IndexedDB("chatApp");
    }

    return this.instace;
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        const request = window.indexedDB.open(
          this.name,
          Number(process.env.REACT_APP_INDEXED_DB_VERSION) || 1
        );

        request.onerror = (event: Event) => {
          throw event;
        };

        request.onsuccess = (event: Event) => {
          this.db = (event.target as IDBOpenDBRequest).result;

          resolve(true);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Conversation
          const conversationObjectStore = db.createObjectStore("conversation", {
            keyPath: "user._id",
          });
          conversationObjectStore.createIndex(
            "conversationUserName",
            "user.name",
            {
              unique: false,
            }
          );

          // Message
          const messageObjectStore = db.createObjectStore("message", {
            keyPath: ["fromId", "toId", "sendTime"],
          });
          messageObjectStore.createIndex("messageId", ["fromId", "toId"], {
            unique: false,
          });
        };
      } else {
        resolve(true);
      }
    });
  }

  public getConversations(): Promise<IConversation[]> {
    return new Promise((resolve, reject) => {
      console.log("DB: ", this.db);
      if (this.db) {
        const request = this.db
          .transaction("conversation")
          .objectStore("conversation")
          .getAll();

        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };

        request.onerror = (event) => {
          reject(event);
        };
      } else resolve([]);
    });
  }

  public getMessages(myId: string, otherId: string): Promise<IMessage[]> {
    let isLoadMyMessage = false;
    let isLoadOtherMessage = false;

    const result: IMessage[] = [];

    return new Promise((resolve, reject) => {
      if (this.db) {
        const requestMyMessage = this.db
          .transaction("message")
          .objectStore("message")
          .index("messageId")
          .getAll(IDBKeyRange.only([myId, otherId]));

        requestMyMessage.onsuccess = (event) => {
          const data: IMessage[] = (event.target as IDBRequest).result;

          result.push(...data);

          if (isLoadOtherMessage) resolve(result);
          else isLoadMyMessage = true;
        };

        const requestOtherMessage = this.db
          .transaction("message")
          .objectStore("message")
          .index("messageId")
          .getAll(IDBKeyRange.only([otherId, myId]));

        requestOtherMessage.onsuccess = (event) => {
          const data: IMessage[] = (event.target as IDBRequest).result;

          result.push(...data);

          if (isLoadMyMessage) resolve(result);
          else isLoadOtherMessage = true;
        };
      } else {
        resolve([]);
      }
    });
  }
}
