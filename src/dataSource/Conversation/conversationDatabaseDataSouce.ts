import { IConversation } from "../../domains";
import { IConversationStorageDataSource } from "../../repository";

export interface IConversationDatabase {
  getConversations(): Promise<IConversation[]>;
  getConversationByUserId(userId: string): Promise<IConversation | null>;
  getConversationById(id: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}

export class ConversationDatabaseDataSource
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

  getConversationById(id: string): Promise<IConversation | null> {
    return this.database.getConversationById(id);
  }
}