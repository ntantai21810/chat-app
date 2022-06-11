import { IMessage } from "../../domains/Message";
import { IMessageIndexedDBStorage } from "../../storage/IStorage";
import { IMessageDataSouce } from "./IMessageDataSource";

export default class MessageIndexedDBDataSource implements IMessageDataSouce {
  private storage: IMessageIndexedDBStorage;

  constructor(storage: IMessageIndexedDBStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  getMessages(myId: string, otherId: string): Promise<IMessage[]> {
    return this.storage.getMessages(myId, otherId);
  }
}
