import { IFile } from "../common/helper";
import { MessageStatus, MessageType } from "./IMessage";

export class MessageModel {
  private id: string;
  private clientId: string;
  private conversationId: string;
  private fromId: string;
  private toId: string;
  private type: MessageType;
  private content: string | IFile[];
  private sendTime: string;
  private status: MessageStatus;

  constructor(
    fromId: string,
    toId: string,
    conversationId: string,
    type: MessageType,
    content: string | IFile[],
    clientId: string,
    sendTime: string,
    status: MessageStatus = MessageStatus.PENDING,
    id?: string
  ) {
    this.fromId = fromId;
    this.toId = toId;
    this.type = type;
    this.content = content;
    this.conversationId = conversationId;
    this.clientId = clientId;
    this.sendTime = sendTime;
    this.status = status;

    if (id) this.id = id;
  }

  getId() {
    return this.id;
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

  getConversationId() {
    return this.conversationId;
  }

  getClientId() {
    return this.clientId;
  }

  getStatus() {
    return this.status;
  }

  setId(id: string) {
    this.id = id;
  }

  setConversationId(id: string) {
    this.conversationId = id;
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

  setClientId(clientId: string) {
    this.clientId = clientId;
  }

  setStatus(status: MessageStatus) {
    this.status = status;
  }
}
