import { IAuth } from "../../domains/Auth";
import { Moment } from "../../helper/configs/moment";
import { IAuthLocalStorage } from "../../storage";
import { IAuthDataSouce } from "./IAuthDataSource";

export default class AuthStorageDataSource implements IAuthDataSouce {
  private storage: IAuthLocalStorage;

  constructor(storage: IAuthLocalStorage) {
    this.storage = storage;
  }

  async login(phone: string, password: string): Promise<IAuth> {
    return Promise.resolve({
      user: {
        _id: "",
        fullName: "",
        phone: "",
        avatar: "",
        lastOnlineTime: Moment().toString(),
      },
      accessToken: "",
    });
  }

  async register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<IAuth> {
    return Promise.resolve({
      user: {
        _id: "",
        fullName: "",
        phone: "",
        avatar: "",
        lastOnlineTime: Moment().toString(),
      },
      accessToken: "",
    });
  }

  loadAuth(): IAuth | null {
    return this.storage.getAuth();
  }

  logout(): void {
    this.storage.clearAuth();
  }

  setAuth(auth: IAuth): void {
    this.storage.setAuth(auth);
  }
}
