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

  // sendTyping(toUserId: string, isTyping: boolean): void {
  //   this.socket.send(SOCKET_CONSTANTS.TYPING, { isTyping, toUserId });
  // }

  // listenTyping(callback: (userId: string, isTyping: boolean) => void): void {
  //   this.socket.listen(SOCKET_CONSTANTS.TYPING, (data) => {
  //     const { fromUserId, isTyping } = data;

  //     callback(fromUserId, isTyping);
  //   });
  // }

  // removeListenTyping(): void {
  //   this.socket.removeAllListen(SOCKET_CONSTANTS.TYPING);
  // }
}
