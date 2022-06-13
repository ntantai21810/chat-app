import { IConversation } from "../domains/Conversation";
import { IMessage } from "./../domains/Message/IMessage";

export interface IConversationIndexedDBStorage {
  connect(): Promise<any>;
  getConversations(): Promise<IConversation[]>;
  getConversation(userId: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}

export interface IMessageIndexedDBStorage {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
}
