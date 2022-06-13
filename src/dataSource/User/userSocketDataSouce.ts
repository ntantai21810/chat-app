import { IUser } from "../../domains/User";
import { ISocket } from "./../../network/socket/ISocket";
import { IUserDataSouce } from "./IUserDataSource";

export default class UserSocketDataSource implements IUserDataSouce {
  private socket: ISocket;

  constructor(socket: ISocket) {
    this.socket = socket;
  }

  listenUserOnline(
    channel: string,
    callback: (users: IUser | IUser[]) => void
  ): void {
    this.socket.listen(channel, callback);
  }

  send(channel: string, data: any): void {
    this.socket.send(channel, data);
  }

  getUser(id: string): Promise<IUser | null> {
    return Promise.resolve(null);
  }

  listenUserOffline(channel: string, callback: (user: IUser) => void): void {
    this.socket.listen(channel, callback);
  }
}
