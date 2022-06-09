import { IMessage } from "./../domains/Message/IMessage";
import { IAuth } from "../domains/Auth";
import { IConversation } from "../domains/Conversation";

export interface IAuthStorage {
  getAuth(): IAuth | null;
  setAuth(auth: IAuth): void;
  clearAuth(): void;
}

export interface IConversationStorage {
  connect(): Promise<any>;
  getConversations(): Promise<IConversation[]>;
}

export interface IMessageStorage {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
}
