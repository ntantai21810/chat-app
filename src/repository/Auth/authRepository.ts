import { IAuthStorage } from "./../../storage/IStorage";
import { modelAuthData } from "../../controller/Auth/helper";
import { IAuthDataSouce } from "../../dataSource";
import { IAuthRepository } from "./IAuthRepository";
import { AuthModel } from "../../domains/Auth";

export default class AuthRepository implements IAuthRepository {
  private dataSource: IAuthDataSouce;
  private storage: IAuthStorage;

  constructor(dataSource?: IAuthDataSouce, storage?: IAuthStorage) {
    if (dataSource) this.dataSource = dataSource;

    if (storage) this.storage = storage;
  }

  async login(phone: string, password: string) {
    const auth = await this.dataSource.login(phone, password);

    this.dataSource.setAccessToken(auth.accessToken);
    this.storage.setAuth(auth);

    const authModel = modelAuthData(auth);

    return authModel;
  }

  async register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<AuthModel> {
    const auth = await this.dataSource.register(phone, fullName, password);

    this.dataSource.setAccessToken(auth.accessToken);
    this.storage.setAuth(auth);

    const authModel = modelAuthData(auth);

    return authModel;
  }

  getAuth(): AuthModel | null {
    const auth = this.storage.getAuth();

    if (!auth) return null;

    const authModel = modelAuthData(auth);

    return authModel;
  }

  clearAuth(): void {
    this.storage.clearAuth();
  }
}
