import { io, Socket as SocketIO } from "socket.io-client";
import { SOCKET_CONSTANTS } from "../../helper";

export interface ISocket {
  connect(userId: string, accessToken: string): void;
  disconnect(): void;
  listen(channel: string, callback: (data: any) => any): void;
  send(channel: string, data: any): void;
  removeListen(channel: string): void;
}

export class Socket implements ISocket {
  private static instance: Socket;

  private socket: SocketIO;
  private url: string;
  private isConnected: boolean;

  private constructor(url: string) {
    this.url = url;
    this.isConnected = false;
  }

  public static getIntance() {
    if (!this.instance) {
      this.instance = new Socket("http://localhost:8000");
    }

    return this.instance;
  }

  connect(userId: string, accessToken: string): void {
    this.socket = io(this.url);

    this.socket.emit(SOCKET_CONSTANTS.JOIN, userId);

    this.socket.on("connect", () => (this.isConnected = true));
    this.socket.on("disconnect", () => (this.isConnected = false));
  }

  listen(channel: string, callback: (data: any) => any): void {
    this.socket.on(channel, callback);
  }

  send(channel: string, data: any): void {
    if (!this.isConnected) {
      throw "Socket disconnected";
    }

    this.socket.emit(channel, data);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  removeListen(channel: string): void {
    this.socket.off(channel);
  }
}
