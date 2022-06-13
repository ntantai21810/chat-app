import { IUser } from "../../domains/User";

export interface IUserDataSouce {
  listenUserOnline(
    channel: string,
    callback: (users: IUser | IUser[]) => void
  ): void;

  send(channel: string, data?: any): void;
  getUser(id: string): Promise<IUser | null>;
  listenUserOffline(channel: string, callback: (user: IUser) => void): void;
}
