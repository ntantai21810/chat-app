import { IFile } from "./../domains/common/helper";
import {
  IConversationDatabase,
  IDatabase,
  IFriendDatabase,
  IMessageStorage,
} from "../dataSource";
import {
  IConversation,
  IMessage,
  IQueryOption,
  IUser,
  MessageType,
} from "../domains";
import { tokenizer } from "../helper";

export class IndexedDB
  implements IConversationDatabase, IMessageStorage, IDatabase, IFriendDatabase
{
  private static instace: IndexedDB;
  private db: IDBDatabase | undefined;

  public static getInstance() {
    if (!this.instace) this.instace = new IndexedDB();

    return this.instace;
  }

  public connect(name: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.log(
          "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );

        reject(
          "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );
      }

      if (!this.db) {
        const request = window.indexedDB.open(
          `${userId}_${name}`,
          Number(process.env.REACT_APP_INDEXED_DB_VERSION) || 1
        );

        request.onerror = (event: Event) => {
          reject(event);
        };

        request.onsuccess = (event: Event) => {
          this.db = (event.target as IDBOpenDBRequest).result;

          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Conversation
          const conversationObjectStore = db.createObjectStore("conversation", {
            keyPath: "id",
          });

          conversationObjectStore.createIndex("userId", "userId", {
            unique: true,
          });

          db.createObjectStore("friend", {
            keyPath: "_id",
          });

          // Message
          const messageObjectStore = db.createObjectStore("message", {
            keyPath: ["fromId", "toId", "clientId"],
          });

          messageObjectStore.createIndex("conversationId", "conversationId", {
            unique: false,
          });

          messageObjectStore.createIndex(
            "messageSendTime",
            ["conversationId", "sendTime"],
            {
              unique: true,
            }
          );

          //Full text search
          const searchObjectStore = db.createObjectStore("search", {
            autoIncrement: true,
          });

          searchObjectStore.createIndex("keyword", "keyword", {
            multiEntry: true,
          });
        };
      } else {
        resolve();
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();

      this.db = undefined;
    }
  }

  public getConversations(): Promise<IConversation[]> {
    return new Promise((resolve, reject) => {
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

  public getConversationByUserId(
    userId: string
  ): Promise<IConversation | null> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction("conversation")
          .objectStore("conversation")
          .index("userId")
          .get(userId);

        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };

        request.onerror = (event) => {
          reject(event);
        };
      } else resolve(null);
    });
  }

  public getMessagesByConversation(
    conversationId: string,
    options: IQueryOption = { paginate: { page: 1, pageSize: 15 } }
  ): Promise<IMessage[]> {
    const { page, pageSize } = options.paginate;

    const result: IMessage[] = [];
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    let index = 0;

    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction("message")
          .objectStore("message")
          .index("messageSendTime")
          .openCursor(
            IDBKeyRange.bound(
              [conversationId, new Date(-8640000000000000).toISOString()],
              [conversationId, new Date().toISOString()]
            ),
            "prev"
          );

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest)
            .result as IDBCursorWithValue;

          if (cursor && index < to) {
            if (index >= from) result.unshift(cursor.value);

            cursor.continue();

            index++;
          } else {
            resolve(result);
          }
        };

        request.onerror = (event) => {
          reject(event);
        };
      } else {
        resolve([]);
      }
    });
  }

  public addMessage(message: IMessage): void {
    if (this.db) {
      this.db
        .transaction("message", "readwrite")
        .objectStore("message")
        .add(message);

      //Add to search DB
      if (message.type === MessageType.TEXT) {
        const tokens = tokenizer(message.content as string);

        for (let keyword of tokens) {
          this.db.transaction("search", "readwrite").objectStore("search").add({
            keyword,
            message,
          });
        }
      }

      if (message.type === MessageType.FILE) {
        const tokens = tokenizer(
          (message.content as IFile[]).map((file) => file.name).join(" ")
        );

        for (let keyword of tokens) {
          this.db.transaction("search", "readwrite").objectStore("search").add({
            keyword,
            message,
          });
        }
      }
    }
  }

  addConversation(conversation: IConversation): void {
    if (this.db)
      this.db
        .transaction("conversation", "readwrite")
        .objectStore("conversation")
        .add(conversation);
  }

  updateConversation(conversation: IConversation): void {
    if (this.db)
      this.db
        .transaction("conversation", "readwrite")
        .objectStore("conversation")
        .put(conversation);
  }

  getAllFriend(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction("friend")
          .objectStore("friend")
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

  addFriend(friend: IUser): void {
    if (this.db)
      this.db
        .transaction("friend", "readwrite")
        .objectStore("friend")
        .add(friend);
  }

  updateMessage(message: IMessage): void {
    if (this.db)
      this.db
        .transaction("message", "readwrite")
        .objectStore("message")
        .put(message);
  }

  getConversationById(id: string): Promise<IConversation | null> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction("conversation")
          .objectStore("conversation")
          .get(id);

        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result);
        };

        request.onerror = (event) => {
          reject(event);
        };
      } else {
        reject();
      }
    });
  }

  deleteMessage(message: IMessage): void {
    if (this.db)
      this.db
        .transaction("message", "readwrite")
        .objectStore("message")
        .delete([message.fromId, message.toId, message.clientId]);
  }
}
