import { MessageType } from "./IMessage";

export default class MessageModel {
  private fromId: string;
  private toId: string;
  private type: MessageType;
  private content: string;
  private sendTime: string;

  constructor(
    fromId: string,
    toId: string,
    type: MessageType,
    content: string,
    sendTime: string
  ) {
    this.fromId = fromId;
    this.toId = toId;
    this.type = type;
    this.content = content;
    this.sendTime = sendTime;
  }

  getFromId() {
    return this.fromId;
  }

  getToId() {
    return this.toId;
  }

  getType() {
    return this.type;
  }

  getContent() {
    return this.content;
  }

  getSendTime() {
    return this.sendTime;
  }

  setFromId(id: string) {
    this.fromId = id;
  }

  setToId(id: string) {
    this.toId = id;
  }

  setType(type: MessageType) {
    this.type = type;
  }

  setContent(content: string) {
    this.content = content;
  }

  setSendTime(sendTime: string) {
    this.sendTime = sendTime;
  }
}
