import { IAuth } from "../domains/Auth";
import { IConversation } from "../domains/Conversation";
import { IMessage } from "./../domains/Message/IMessage";

export interface IConversationIndexedDBStorage {
  connect(name: string, userId: string): Promise<any>;
  getConversations(): Promise<IConversation[]>;
  getConversation(userId: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}

export interface IMessageIndexedDBStorage {
  connect(name: string, userId: string): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
}

export interface IAuthLocalStorage {
  getAuth(): IAuth | null;
  setAuth(auth: IAuth): void;
  clearAuth(): void;
}
