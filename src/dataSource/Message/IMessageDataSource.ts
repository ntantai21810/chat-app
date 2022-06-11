import { IMessage } from "./../../domains/Message/IMessage";

export interface IMessageDataSouce {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<IMessage[]>;
}
