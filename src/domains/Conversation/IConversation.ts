import { IMessage } from "./../Message/IMessage";

export interface IConversation {
  id: string;
  userId: string;
  lastMessage: IMessage;
}
