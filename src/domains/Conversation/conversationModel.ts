import { UserModel } from "../User";
import { MessageModel } from "../Message/index";

export default class ConversationModel {
  private user: UserModel;
  private lastMessage: MessageModel;

  constructor(user: UserModel, lastMessage: MessageModel) {
    this.user = user;
    this.lastMessage = lastMessage;
  }

  getUser() {
    return this.user;
  }

  getLastMessage() {
    return this.lastMessage;
  }

  setUser(user: UserModel) {
    this.user = user;
  }

  setLastMessage(message: MessageModel) {
    this.lastMessage = message;
  }
}
