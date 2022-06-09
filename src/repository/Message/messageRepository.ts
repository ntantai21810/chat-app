import { modelMessageData } from "../../controller/Message/helper";
import { MessageModel } from "../../domains/Message";
import { IMessageStorage } from "../../storage/IStorage";
import { IMessageRepository } from "./IMessageRepository";

export default class MessageRepository implements IMessageRepository {
  private storage: IMessageStorage;

  constructor(storage: IMessageStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  async getMessages(myId: string, otherId: string): Promise<MessageModel[]> {
    const res = await this.storage.getMessages(myId, otherId);

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }
}
