import { IConversation } from "../../domains/Conversation";

export interface IConversationDataSouce {
  connect(): Promise<any>;
  getConversations(): Promise<IConversation[]>;
}
