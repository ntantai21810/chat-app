import { IConversationIndexedDBStorage } from "../../storage/IStorage";
import { IConversation } from "../../domains/Conversation";
import { IConversationDataSouce } from "./IConversationDataSource";

export default class ConversationIndexedDBDataSource
  implements IConversationDataSouce
{
  private storage: IConversationIndexedDBStorage;

  constructor(storage: IConversationIndexedDBStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  getConversations(): Promise<IConversation[]> {
    return this.storage.getConversations();
  }
}
