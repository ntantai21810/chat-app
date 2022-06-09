import { IMessage } from "./../../domains/Message/IMessage";

export interface IMessageDataSouce {
  connect(): Promise<any>;
  getMessage(myId: string, otherId: string): Promise<IMessage[]>;
}
