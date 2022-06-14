import { IAuthDataSouce } from "../../dataSource";
import { AuthModel } from "../../domains/Auth";
import { modelAuthData, normalizeAuthData } from "../../domains/Auth/helper";
import {
  CredentialModel,
  normalizeCredentialData,
} from "../../domains/Credential";
import {
  ILoadAuthRepo,
  ILoginRepo,
  ILogoutRepo,
  IRegisterRepo,
  ISetAuthRepo,
} from "../../useCases";

export default class AuthRepository
  implements
    ILoginRepo,
    IRegisterRepo,
    ILoadAuthRepo,
    ILogoutRepo,
    ISetAuthRepo
{
  private dataSource: IAuthDataSouce;

  constructor(dataSource: IAuthDataSouce) {
    this.dataSource = dataSource;
  }

  async login(credentialModel: CredentialModel) {
    const { phone, password } = normalizeCredentialData(credentialModel);

    const auth = await this.dataSource.login(phone, password);

    const authModel = modelAuthData(auth);

    return authModel;
  }

  async register(credentialModel: CredentialModel): Promise<AuthModel> {
    const {
      phone,
      password,
      fullName = "",
    } = normalizeCredentialData(credentialModel);

    const auth = await this.dataSource.register(phone, fullName, password);

    const authModel = modelAuthData(auth);

    return authModel;
  }

  loadAuth(): AuthModel | null {
    const auth = this.dataSource.loadAuth();

    if (!auth) return null;

    const authModel = modelAuthData(auth);

    return authModel;
  }

  setAuth(authModel: AuthModel): void {
    const auth = normalizeAuthData(authModel);

    this.dataSource.setAuth(auth);
  }

  logout(): void {
    this.dataSource.logout();
  }
}
