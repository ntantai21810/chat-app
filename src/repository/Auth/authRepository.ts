import { IAuthDataSouce } from "../../dataSource";
import { AuthModel } from "../../domains/Auth";
import { modelAuthData } from "../../domains/Auth/helper";
import {
  CredentialModel,
  normalizeCredentialData,
} from "../../domains/Credential";
import {
  ILoadAuthRepo,
  ILoginRepo,
  ILogoutRepo,
  IRegisterRepo,
} from "../../useCases";

export default class AuthRepository
  implements ILoginRepo, IRegisterRepo, ILoadAuthRepo, ILogoutRepo
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

  async loadAuth(): Promise<AuthModel | null> {
    const auth = await this.dataSource.loadAuth();

    if (!auth) return null;

    const authModel = modelAuthData(auth);

    return authModel;
  }

  logout(): Promise<boolean> {
    return this.dataSource.logout();
  }
}
