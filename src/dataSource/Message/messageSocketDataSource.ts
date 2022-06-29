import { IMessage } from "../../domains";
import { IMessageSocketDataSouce } from "../../repository";

export interface IMessageSocket {
  sendMessage(message: IMessage): void;
  ackMessage(message: IMessage): void;
}

export class MessageSocketDataSource implements IMessageSocketDataSouce {
  private socket: IMessageSocket;

  constructor(socket: IMessageSocket) {
    this.socket = socket;
  }

  sendMessage(message: IMessage): void {
    this.socket.sendMessage(message);
  }

  ackMessage(message: IMessage): void {
    this.socket.ackMessage(message);
  }
}
