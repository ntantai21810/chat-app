import { IConversationIndexedDBStorage } from "../../storage/IStorage";
import { IConversation } from "../../domains/Conversation";
import { IConversationDataSouce } from "./IConversationDataSource";

export default class ConversationDBDataSource
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

  getConversation(userId: string): Promise<IConversation | null> {
    return this.storage.getConversation(userId);
  }

  addConversation(conversation: IConversation): void {
    this.storage.addConversation(conversation);
  }

  updateConversation(conversation: IConversation): void {
    this.storage.updateConversation(conversation);
  }
}
