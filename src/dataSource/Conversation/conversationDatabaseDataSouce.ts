import { IConversation } from "../../domains/Conversation";
import { IConversationStorageDataSource } from "../../repository/Conversation/conversationStorageRepository";

export interface IConversationDatabase {
  getConversations(): Promise<IConversation[]>;
  getConversationByUserId(userId: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}

export default class ConversationDatabaseDataSource
  implements IConversationStorageDataSource
{
  private database: IConversationDatabase;

  constructor(database: IConversationDatabase) {
    this.database = database;
  }

  getConversations(): Promise<IConversation[]> {
    return this.database.getConversations();
  }

  getConversationByUserId(userId: string): Promise<IConversation | null> {
    return this.database.getConversationByUserId(userId);
  }

  addConversation(conversation: IConversation): void {
    this.database.addConversation(conversation);
  }

  updateConversation(conversation: IConversation): void {
    this.database.updateConversation(conversation);
  }
}
