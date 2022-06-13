import { IMessage } from "../../domains/Message";
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
}
