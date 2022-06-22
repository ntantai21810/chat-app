import { v4 as uuidv4 } from "uuid";
import { MessageModel } from "../Message/index";

export default class ConversationModel {
  private id: string;
  private userId: string;
  private lastMessage: MessageModel;

  constructor(userId: string, lastMessage: MessageModel) {
    this.id = uuidv4();
    this.userId = userId;
    this.lastMessage = lastMessage;
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getLastMessage() {
    return this.lastMessage;
  }

  setId(id: string) {
    this.id = id;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setLastMessage(message: MessageModel) {
    this.lastMessage = message;
  }
}
