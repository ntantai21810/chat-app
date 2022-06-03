export enum MessageType {
  TEXT,
  IMAGE,
  FILE,
}

export interface IMessage {
  fromId: string;
  toId: string;
  type: MessageType;
  content: string;
  sendTime: string;
}
