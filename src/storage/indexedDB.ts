export interface IDatabase {
  connect(name: string, userId: string): Promise<void>;
  disconnect(): Promise<void>;

  get<T>(
    transaction: string | string[],
    objectStore: string,
    key?: IDBValidKey | IDBKeyRange | null,
    index?: string,
    limit?: number
  ): Promise<T[]>;

  getOne<T>(
    transaction: string | string[],
    objectStore: string,
    key: IDBValidKey | IDBKeyRange,
    index?: string
  ): Promise<T | null>;

  add<T>(
    transaction: string | string[],
    objectStore: string,
    document: T
  ): Promise<void>;

  update<T>(
    transaction: string | string[],
    objectStore: string,
    document: T
  ): Promise<void>;

  delete<T>(
    transaction: string | string[],
    objectStore: string,
    key: IDBValidKey | IDBKeyRange
  ): Promise<void>;

  count<T>(
    transaction: string | string[],
    objectStore: string,
    key?: IDBKeyRange
  ): Promise<number>;
}

export class IndexedDB implements IDatabase {
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
          const keywordObjectStore = db.createObjectStore("keyword", {
            autoIncrement: true,
          });
          keywordObjectStore.createIndex("keywordId", "keyword");

          const keywordIdxObjectStore = db.createObjectStore("keywordIdx", {
            autoIncrement: true,
          });

          keywordIdxObjectStore.createIndex("search", ["keywordId", "freq"]);
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

  public get<T>(
    transaction: string | string[],
    objectStore: string,
    key?: IDBValidKey | IDBKeyRange | null,
    index?: string,
    limit?: number
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        if (index) {
          if (limit) {
            let l = limit;

            const result: T[] = [];

            const request = this.db
              .transaction(transaction)
              .objectStore(objectStore)
              .index(index)
              .openCursor(key, "prev");

            request.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest)
                .result as IDBCursorWithValue;

              if (cursor && l > 0) {
                result.unshift(cursor.value);

                l--;

                cursor.continue();
              } else {
                resolve(result);
              }
            };

            request.onerror = (event) => {
              reject(event);
            };
          } else {
            const request = this.db
              .transaction(transaction)
              .objectStore(objectStore)
              .index(index)
              .getAll(key);

            request.onsuccess = (event) => {
              const result = (event.target as IDBRequest).result;

              resolve(result);
            };

            request.onerror = (event) => {
              reject(event);
            };
          }
        } else {
          if (limit) {
            let l = limit;

            const result: T[] = [];

            const request = this.db
              .transaction(transaction)
              .objectStore(objectStore)
              .openCursor(key, "prev");

            request.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest)
                .result as IDBCursorWithValue;

              if (cursor && l > 0) {
                result.unshift(cursor.value);

                l--;

                cursor.continue();
              } else {
                resolve(result);
              }
            };

            request.onerror = (event) => {
              reject(event);
            };
          } else {
            const request = this.db
              .transaction(transaction)
              .objectStore(objectStore)
              .getAll(key);

            request.onsuccess = (event) => {
              const result = (event.target as IDBRequest).result;

              resolve(result);
            };

            request.onerror = (event) => {
              reject(event);
            };
          }
        }
      } else {
        resolve([]);
      }
    });
  }

  public getOne<T>(
    transaction: string | string[],
    objectStore: string,
    key: IDBValidKey | IDBKeyRange,
    index?: string
  ): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        if (index) {
          const request = this.db
            .transaction(transaction)
            .objectStore(objectStore)
            .index(index)
            .get(key);

          request.onsuccess = (event) => {
            const result = (event.target as IDBRequest).result;

            resolve(result);
          };

          request.onerror = (event) => {
            reject(event);
          };
        } else {
          const request = this.db
            .transaction(transaction)
            .objectStore(objectStore)
            .get(key);

          request.onsuccess = (event) => {
            const result = (event.target as IDBRequest).result;

            resolve(result);
          };

          request.onerror = (event) => {
            reject(event);
          };
        }
      } else {
        resolve(null);
      }
    });
  }

  public add<T>(
    transaction: string | string[],
    objectStore: string,
    document: T
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction(transaction, "readwrite")
          .objectStore(objectStore)
          .add(document);

        request.onsuccess = (event) => {
          resolve();
        };

        request.onerror = (event) => {
          reject();
        };
      } else resolve();
    });
  }

  public update<T>(
    transaction: string | string[],
    objectStore: string,
    document: T
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction(transaction, "readwrite")
          .objectStore(objectStore)
          .put(document);

        request.onsuccess = (event) => {
          resolve();
        };

        request.onerror = (event) => {
          reject();
        };
      } else resolve();
    });
  }

  public delete<T>(
    transaction: string | string[],
    objectStore: string,
    key: IDBValidKey | IDBKeyRange
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction(transaction, "readwrite")
          .objectStore(objectStore)
          .delete(key);

        request.onsuccess = (event) => {
          resolve();
        };

        request.onerror = (event) => {
          reject();
        };
      } else resolve();
    });
  }

  public count<T>(
    transaction: string | string[],
    objectStore: string,
    key?: IDBKeyRange
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const request = this.db
          .transaction(transaction)
          .objectStore(objectStore)
          .count(key);

        request.onsuccess = function () {
          resolve(request.result);
        };
      } else {
        resolve(0);
      }
    });
  }
}
