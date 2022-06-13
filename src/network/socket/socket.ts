import { SOCKET_CONSTANTS } from "./../../helper/constants/index";
import { io, Socket as SocketIO } from "socket.io-client";
import { ISocket } from "./ISocket";

export default class Socket implements ISocket {
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
    if (!this.socket) {
      this.socket = io(this.url);

      this.socket.emit(SOCKET_CONSTANTS.JOIN, userId);
    }
  }

  public listen(channel: string, callback: (data: any) => any): void {
    this.socket.on(channel, callback);
  }

  send(channel: string, data: any): void {
    this.socket.emit(channel, data);
  }
}
