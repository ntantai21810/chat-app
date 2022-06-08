import { UserModel } from "../User";
import { MessageModel } from "../Message/index";

export default class ConversationModel {
  private user: UserModel;
  private lastMessage: MessageModel;
  private lastOnlineTime: string = "";

  constructor(
    user: UserModel,
    lastMessage: MessageModel,
    lastOnlineTime: string
  ) {
    this.user = user;
    this.lastMessage = lastMessage;
    this.lastOnlineTime = lastOnlineTime;
  }

  getUser() {
    return this.user;
  }

  getLastMessage() {
    return this.lastMessage;
  }

  getLastOnlineTime() {
    return this.lastOnlineTime;
  }

  setUser(user: UserModel) {
    this.user = user;
  }

  setLastMessage(message: MessageModel) {
    this.lastMessage = message;
  }

  setLastOnlineTime(time: string) {
    this.lastOnlineTime = time;
  }
}
