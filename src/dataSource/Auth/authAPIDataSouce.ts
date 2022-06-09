import { IAuth } from "../../domains/Auth";
import { IAPI } from "../../network/api";
import { IAuthDataSouce } from "./IAuthDataSource";

export default class AuthAPIDataSource implements IAuthDataSouce {
  private api: IAPI;

  constructor(api: IAPI) {
    this.api = api;
  }

  login(phone: string, password: string): Promise<IAuth> {
    return this.api.post("/login", { phone, password });
  }

  register(phone: string, fullName: string, password: string): Promise<IAuth> {
    return this.api.post("/register", { phone, fullName, password });
  }

  setAccessToken(accessToken: string): void {
    this.api.setAccessToken(accessToken);
  }
}
