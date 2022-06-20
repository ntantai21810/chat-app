import { IAuth } from "../../domains/Auth";
import { IAuthAPIDataSource } from "../../repository/Auth/authAPIRepository";

export interface IAuthAPI {
  login(phone: string, password: string): Promise<IAuth>;
  register(phone: string, fullName: string, password: string): Promise<IAuth>;
  setAccessTokenInterceptor(accessToken: string): void;
}

export default class AuthAPIDataSource implements IAuthAPIDataSource {
  private api: IAuthAPI;

  constructor(api: IAuthAPI) {
    this.api = api;
  }

  async login(phone: string, password: string): Promise<IAuth> {
    const res: IAuth = await this.api.login(phone, password);

    this.api.setAccessTokenInterceptor(res.accessToken);

    return res;
  }

  async register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<IAuth> {
    const res: IAuth = await this.api.register(phone, fullName, password);

    this.api.setAccessTokenInterceptor(res.accessToken);

    return res;
  }

  setAccessTokenInterceptor(accessToken: string): void {
    this.api.setAccessTokenInterceptor(accessToken);
  }
}
