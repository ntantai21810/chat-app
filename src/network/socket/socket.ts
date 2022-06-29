import { io, Socket as SocketIO } from "socket.io-client";
import { IMessageSocket, ISocket } from "../../dataSource";
import { IMessage } from "../../domains";
import { SOCKET_CONSTANTS } from "../../helper/constants";

export class Socket implements IMessageSocket, ISocket {
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

  sendMessage(message: IMessage): void {
    if (!this.isConnected) {
      throw "Socket disconnected";
    }

    this.socket.emit(SOCKET_CONSTANTS.CHAT_MESSAGE, message);
  }

  ackMessage(message: IMessage): void {
    if (!this.isConnected) {
      throw "Socket disconnected";
    }

    this.socket.emit(SOCKET_CONSTANTS.ACK_MESSAGE, message);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  removeAllListener(channel: string): void {
    this.socket.off(channel);
  }
}