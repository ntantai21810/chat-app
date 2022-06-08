import { IMessage } from "./../Message/IMessage";
import { IUser } from "./../User/IUser";

export interface IConversation {
  user: IUser;
  lastMessage: IMessage;
  lastOnlineTime: string;
}
