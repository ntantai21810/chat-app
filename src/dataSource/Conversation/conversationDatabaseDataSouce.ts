import { IConversation } from "../../domains";
import { IDatabase } from "../../storage";

export class ConversationDatabaseDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  getConversations(): Promise<IConversation[]> {
    return this.database.get<IConversation>("conversation", "conversation");
  }

  getConversationByUserId(userId: string): Promise<IConversation | null> {
    return this.database.getOne(
      "conversation",
      "conversation",
      userId,
      "userId"
    );
  }

  addConversation(conversation: IConversation): void {
    this.database.add<IConversation>(
      "conversation",
      "conversation",
      conversation
    );
  }

  updateConversation(conversation: IConversation): void {
    this.database.update<IConversation>(
      "conversation",
      "conversation",
      conversation
    );
  }

  getConversationById(id: string): Promise<IConversation | null> {
    return this.database.getOne("conversation", "conversation", id);
  }
}
