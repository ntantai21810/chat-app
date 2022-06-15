import { IMessage } from "../../domains/Message";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { ISocket } from "./../../network/socket/ISocket";
import { IMessageDataSouce } from "./IMessageDataSource";

export default class MessageSocketDataSource implements IMessageDataSouce {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  connect(): Promise<any> {
    return Promise.resolve(null);
  }

  getMessages(myId: string, otherId: string): Promise<IMessage[]> {
    return Promise.resolve([]);
  }

  addMessage(message: IMessage): void {}

  listenMessage(channel: string, callback: (message: IMessage) => void): void {
    this.socket.listen(channel, callback);
  }

  sendTyping(toUserId: string, isTyping: boolean): void {
    this.socket.send(SOCKET_CONSTANTS.TYPING, { isTyping, toUserId });
  }

  listenTyping(
    channel: string,
    callback: (userId: string, isTyping: boolean) => void
  ): void {
    this.socket.listen(channel, (data) => {
      const { fromUserId, isTyping } = data;

      callback(fromUserId, isTyping);
    });
  }

  removeListenTyping(channel: string): void {
    this.socket.removeAllListen(channel);
  }
}
