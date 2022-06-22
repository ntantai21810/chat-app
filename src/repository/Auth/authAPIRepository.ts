import { AuthModel, IAuth } from "../../domains/Auth";
import { modelAuthData } from "../../domains/Auth/helper";
import {
  CredentialModel,
  normalizeCredentialData,
} from "../../domains/Credential";
import { ILoginRepo, IRegisterRepo } from "../../useCases";
import { ISetAuthAPIRepo } from "../../useCases/Auth/setAuthAPIUseCase";

export interface IAuthAPIDataSource {
  login(phone: string, password: string): Promise<IAuth>;
  register(phone: string, fullName: string, password: string): Promise<IAuth>;
  setAccessTokenInterceptor(accessToken: string): void;
}

export default class AuthAPIRepository
  implements ILoginRepo, IRegisterRepo, ISetAuthAPIRepo
{
  private dataSource: IAuthAPIDataSource;

  constructor(dataSource: IAuthAPIDataSource) {
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

  setAuth(authModel: AuthModel): void {
    this.dataSource.setAccessTokenInterceptor(authModel.getAccessToken());
  }
}
