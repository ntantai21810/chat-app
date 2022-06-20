import { IUser } from "../../domains/User";
import { IUserAPIDataSource } from "../../repository/User/userAPIRepository";

export interface IUserAPI {
  getUserById(id: string): Promise<IUser | null>;
  getUserByPhone(phone: string): Promise<IUser[]>;
}

export default class UserAPIDataSource implements IUserAPIDataSource {
  private api: IUserAPI;

  constructor(api: IUserAPI) {
    this.api = api;
  }

  getUserById(id: string): Promise<IUser | null> {
    return this.api.getUserById(id);
  }

  getUserByPhone(phone: string): Promise<IUser[]> {
    return this.api.getUserByPhone(phone);
  }
}
