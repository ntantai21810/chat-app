import { io, Socket as SocketIO } from "socket.io-client";
import { IMessageSocket } from "../../dataSource";
import { ISocket } from "../../dataSource/Socket/socketDataSouce";
import { IMessage } from "../../domains/Message";
import { SOCKET_CONSTANTS } from "./../../helper/constants/index";

export default class Socket implements IMessageSocket, ISocket {
  private static instance: Socket;

  private socket: SocketIO;
  private url: string;

  private constructor(url: string) {
    this.url = url;
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
  }

  listen(channel: string, callback: (data: any) => any): void {
    this.socket.on(channel, callback);
  }

  send(channel: string, data: any): void {
    this.socket.emit(channel, data);
  }

  sendMessage(message: IMessage): void {
    this.socket.emit(SOCKET_CONSTANTS.CHAT_MESSAGE, message);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  removeAllListener(channel: string): void {
    this.socket.off(channel);
  }
}
