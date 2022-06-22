export interface IMessage {
  id?: string;
  fromId: string;
  toId: string;
  type: MessageType;
  content: string;
  sendTime: string;
  conversationId: string;
  clientId: string;
}

export enum MessageType {
  TEXT,
  IMAGE,
  FILE,
}
