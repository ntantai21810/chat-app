import {
  AuthModel,
  CredentialModel,
  IAuth,
  modelAuthData,
  normalizeCredentialData,
} from "../../domains";
import { ILoginRepo, IRegisterRepo, ISetAuthAPIRepo } from "../../useCases";

export interface IAuthAPIDataSource {
  login(phone: string, password: string): Promise<IAuth>;
  register(
    phone: string,
    fullName: string,
    password: string,
    avatar?: FileList
  ): Promise<IAuth>;
  setAccessTokenInterceptor(accessToken: string): void;
}

export class AuthAPIRepository
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
      avatar,
    } = normalizeCredentialData(credentialModel);

    const auth = await this.dataSource.register(
      phone,
      fullName,
      password,
      avatar
    );

    const authModel = modelAuthData(auth);

    return authModel;
  }

  setAuth(authModel: AuthModel): void {
    this.dataSource.setAccessTokenInterceptor(authModel.getAccessToken());
  }
}
