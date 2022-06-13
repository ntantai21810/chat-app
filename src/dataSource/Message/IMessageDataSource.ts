import { IMessage } from "./../../domains/Message/IMessage";

export interface IMessageDataSouce {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
  listenMessage(channel: string, callback: (message: IMessage) => void): void;
}
