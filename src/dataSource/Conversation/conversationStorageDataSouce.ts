import { IConversationStorage } from "../../storage/IStorage";
import { IConversation } from "../../domains/Conversation";
import { IConversationDataSouce } from "./IConversationDataSource";

export default class ConversationIndexedDBDataSource
  implements IConversationDataSouce
{
  private storage: IConversationStorage;

  constructor(storage: IConversationStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  getConversations(): Promise<IConversation[]> {
    return this.storage.getConversations();
  }
}
