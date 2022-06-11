import { IConversation } from "../domains/Conversation";
import { IMessage } from "./../domains/Message/IMessage";

export interface IConversationIndexedDBStorage {
  connect(): Promise<any>;
  getConversations(): Promise<IConversation[]>;
}

export interface IMessageIndexedDBStorage {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
}
