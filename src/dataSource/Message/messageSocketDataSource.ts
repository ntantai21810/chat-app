import { IMessage } from "../../domains/Message";
import { IMessageSocketDataSouce } from "../../repository/Message/messageSocketRepository";

export interface IMessageSocket {
  sendMessage(message: IMessage): void;
}

export default class MessageSocketDataSource
  implements IMessageSocketDataSouce
{
  private socket: IMessageSocket;

  constructor(socket: IMessageSocket) {
    this.socket = socket;
  }

  sendMessage(message: IMessage): void {
    this.socket.sendMessage(message);
  }
}
