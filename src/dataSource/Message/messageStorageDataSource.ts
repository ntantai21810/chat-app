import { IMessage } from "../../domains/Message";
import { IMessageIndexedDBStorage } from "../../storage/IStorage";
import { IMessageDataSouce } from "./IMessageDataSource";

export default class MessageIndexedDBDataSource implements IMessageDataSouce {
  private storage: IMessageIndexedDBStorage;

  constructor(storage: IMessageIndexedDBStorage) {
    this.storage = storage;
  }

  connect(name: string, userId: string): Promise<any> {
    return this.storage.connect(name, userId);
  }

  getMessages(myId: string, otherId: string): Promise<IMessage[]> {
    return this.storage.getMessages(myId, otherId);
  }

  addMessage(message: IMessage): void {
    this.storage.addMessage(message);
  }

  listenMessage(channel: string, callback: (message: IMessage) => void): void {}

  sendTyping(toUserId: string, isTyping: boolean): void {}

  listenTyping(
    channel: string,
    callback: (userId: string, isTyping: boolean) => void
  ): void {}

  removeListenTyping(channel: string): void {}
}
