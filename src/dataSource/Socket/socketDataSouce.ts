import { ISocketDataSource } from "../../repository";

export interface ISocket {
  connect(userId: string, accessToken: string): void;
  disconnect(): void;
  listen(channel: string, callback: Function): void;
  send(channel: string, data: any): void;
  removeAllListener(channel: string): void;
}

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

  listen(channel: string, callback: Function): void {
    this.socket.listen(channel, callback);
  }

  removeAllListener(channel: string): void {
    this.socket.removeAllListener(channel);
  }
}
