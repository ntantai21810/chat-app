import { IAuth } from "../../domains";
import { IAPI } from "../../network";
import { IAuthAPIDataSource } from "../../repository";

export class AuthAPIDataSource implements IAuthAPIDataSource {
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

  setAccessTokenInterceptor(accessToken: string): void {
    this.api.setAccessToken(accessToken);
  }
}
