import { IUser } from "../../domains";
import { IUserAPIDataSource } from "../../repository";

export interface IUserAPI {
  getUserById(id: string): Promise<IUser | null>;
  getUserByPhone(phone: string): Promise<IUser[]>;
}

export class UserAPIDataSource implements IUserAPIDataSource {
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
