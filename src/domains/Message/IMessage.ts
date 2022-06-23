export interface IMessage {
  id?: string;
  fromId: string;
  toId: string;
  type: MessageType;
  content: string;
  sendTime: string;
  conversationId: string;
  clientId: string;
  status: MessageStatus;
}

export enum MessageType {
  TEXT,
  IMAGE,
  FILE,
}

export enum MessageStatus {
  PENDING,
  SENT,
  RECEIVED,
  ERROR,
}
