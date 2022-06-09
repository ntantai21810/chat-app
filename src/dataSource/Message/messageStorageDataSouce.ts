import { IMessage } from "../../domains/Message";
import { IMessageStorage } from "../../storage/IStorage";
import { IMessageDataSouce } from "./IMessageDataSource";

export default class MessageIndexedDBDataSource implements IMessageDataSouce {
  private storage: IMessageStorage;

  constructor(storage: IMessageStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  getMessage(myId: string, otherId: string): Promise<IMessage[]> {
    return this.storage.getMessages(myId, otherId);
  }
}
