import { ISocket } from "../../network";
import { ISocketDataSource } from "../../repository";

export class SocketDataSource implements ISocketDataSource {
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

  send(channel: string, data: any): void {
    this.socket.send(channel, data);
  }

  listen(channel: string, callback: (data: any) => any): void {
    this.socket.listen(channel, callback);
  }

  removeListener(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void {
    this.socket.removeListen(channel, listener);
  }
}
