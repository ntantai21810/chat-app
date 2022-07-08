import { io, Socket as SocketIO } from "socket.io-client";
import { SOCKET_CONSTANTS } from "../../helper";

export interface ISocket {
  connect(userId: string, accessToken: string): void;
  disconnect(): void;
  listen(channel: string, callback: (data: any) => any): void;
  send(channel: string, data: any): void;
  removeListen(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void;
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
      this.instance = new Socket(
        process.env.REACT_APP_BASE_URL || "http://localhost:8000"
      );
    }

    return this.instance;
  }

  connect(userId: string, accessToken: string): void {
    if (!this.socket) {
      this.socket = io(this.url);

      this.socket.emit(SOCKET_CONSTANTS.JOIN, userId);

      if (this.socket.connected) {
        this.isConnected = true;
      }

      this.socket.on("connect", () => {
        this.socket.emit(SOCKET_CONSTANTS.JOIN, userId);
        this.isConnected = true;
      });
      this.socket.on("disconnect", () => {
        this.isConnected = false;
      });
      this.socket.on("connect_error", () => {
        this.isConnected = false;
      });
    } else if (!this.socket.connected) throw "Socket connect fail";
  }

  listen(channel: string, callback: (data: any) => any): void {
    if (this.socket) this.socket.on(channel, callback);
  }

  send(channel: string, data: any): void {
    if (!this.isConnected) {
      throw "Socket disconnected";
    }

    if (this.socket) this.socket.emit(channel, data);
  }

  disconnect(): void {
    if (this.socket) this.socket.disconnect();
  }

  removeListen(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void {
    if (this.socket) this.socket.off(channel, listener);
  }
}
