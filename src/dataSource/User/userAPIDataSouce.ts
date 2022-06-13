import { IUser } from "../../domains/User";
import { IAPI } from "../../network";
import { IUserDataSouce } from "./IUserDataSource";

export default class UserAPIDataSource implements IUserDataSouce {
  private api: IAPI;

  constructor(api: IAPI) {
    this.api = api;
  }

  listenUserOnline(
    channel: string,
    callback: (users: IUser | IUser[]) => void
  ): void {}

  send(channel: string, data?: any): void {}

  getUser(id: string): Promise<IUser | null> {
    return this.api.get("/users", { id: id });
  }

  listenUserOffline(channel: string, callback: (user: IUser) => void): void {}
}
