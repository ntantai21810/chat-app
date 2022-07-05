import { IMessage } from "../../domains";
import { ISocket } from "../../network";
import { IMessageSocketDataSouce } from "../../repository";
import { SOCKET_CONSTANTS } from "./../../helper/constants/index";

export interface IMessageSocket {
  sendMessage(message: IMessage): void;
  ackMessage(message: IMessage): void;
}

export class MessageSocketDataSource implements IMessageSocketDataSouce {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  sendMessage(message: IMessage): void {
    this.socket.send(SOCKET_CONSTANTS.CHAT_MESSAGE, message);
  }

  ackMessage(message: IMessage): void {
    this.socket.send(SOCKET_CONSTANTS.ACK_MESSAGE, message);
  }
}
