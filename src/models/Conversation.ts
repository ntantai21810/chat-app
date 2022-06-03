import { IMessage } from "./Message";
import { IUser } from "./User";
export interface IConversation {
  user: IUser;
  lastMessage: IMessage;
  lastOnlineTime: string;
}
