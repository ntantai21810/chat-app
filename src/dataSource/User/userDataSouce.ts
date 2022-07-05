import { IUser } from "../../domains";
import { IAPI } from "../../network";
import { IUserAPIDataSource } from "../../repository";

export class UserAPIDataSource implements IUserAPIDataSource {
  private api: IAPI;

  constructor(api: IAPI) {
    this.api = api;
  }

  getUserById(id: string): Promise<IUser | null> {
    return this.api.get(`/users/${id}`);
  }

  getUserByPhone(phone: string): Promise<IUser[]> {
    return this.api.get("/users", { phone });
  }
}
