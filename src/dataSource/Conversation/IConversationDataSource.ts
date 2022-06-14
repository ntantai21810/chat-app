import { IConversation } from "../../domains/Conversation";

export interface IConversationDataSouce {
  connect(name: string, userId: string): Promise<any>;
  getConversations(): Promise<IConversation[]>;
  getConversation(userId: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}
