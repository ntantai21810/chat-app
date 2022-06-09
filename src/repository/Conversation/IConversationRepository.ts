import { ConversationModel } from "../../domains/Conversation";

export interface IConversationRepository {
  connect(): Promise<any>;
  getConversations(): Promise<ConversationModel[]>;
}
