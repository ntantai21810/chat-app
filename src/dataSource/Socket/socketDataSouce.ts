import { ISocket } from "../../network/socket/ISocket";
import { ISocketDataSource } from "./ISocketDataSource";

export default class SocketDataSource implements ISocketDataSource {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  connect(userId: string, accessToken: string): void {
    this.socket.connect(userId, accessToken);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
