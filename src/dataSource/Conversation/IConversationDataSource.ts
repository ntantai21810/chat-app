import { IConversation } from "../../domains/Conversation";

export interface IConversationDataSouce {
  connect(): Promise<any>;
  getConversations(): Promise<IConversation[]>;
  getConversation(userId: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}
