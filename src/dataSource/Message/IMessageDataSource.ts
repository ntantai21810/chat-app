import { IMessage } from "./../../domains/Message/IMessage";

export interface IMessageDataSouce {
  connect(name: string, userId: string): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
  listenMessage(channel: string, callback: (message: IMessage) => void): void;
  sendTyping(toUserId: string, isTyping: boolean): void;
  listenTyping(
    channel: string,
    callback: (userId: string, isTyping: boolean) => void
  ): void;
  removeListenTyping(channel: string): void;
}
