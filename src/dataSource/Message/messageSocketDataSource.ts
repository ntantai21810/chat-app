import { IMessage } from "../../domains";
import { ISocket } from "../../network";
import { IMessageSocketDataSouce } from "../../repository";
import { SOCKET_CONSTANTS } from "./../../helper/constants/index";

export interface IMessageSocket {
  sendMessage(message: IMessage): Promise<void>;
  ackMessage(message: IMessage): void;
}

export class MessageSocketDataSource implements IMessageSocketDataSouce {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  sendMessage(message: IMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.sendWithTimout(
        SOCKET_CONSTANTS.CHAT_MESSAGE,
        message,
        5000,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  ackMessage(message: IMessage): void {
    this.socket.send(SOCKET_CONSTANTS.ACK_MESSAGE, message);
  }
}
