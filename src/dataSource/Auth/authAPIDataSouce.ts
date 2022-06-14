import { IAuth } from "../../domains/Auth";
import { IAPI } from "../../network/api";
import { IAuthDataSouce } from "./IAuthDataSource";

export default class AuthAPIDataSource implements IAuthDataSouce {
  private api: IAPI;

  constructor(api: IAPI) {
    this.api = api;
  }

  async login(phone: string, password: string): Promise<IAuth> {
    const res: IAuth = await this.api.post("/login", { phone, password });

    this.api.setAccessToken(res.accessToken);

    return res;
  }

  async register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<IAuth> {
    const res: IAuth = await this.api.post("/register", {
      phone,
      fullName,
      password,
    });

    this.api.setAccessToken(res.accessToken);

    return res;
  }

  loadAuth(): IAuth | null {
    return null;
  }

  logout(): void {
    return;
  }

  setAuth(auth: IAuth): void {
    this.api.setAccessToken(auth.accessToken);
  }
}
