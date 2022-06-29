import {
  AuthModel,
  IAuth,
  modelAuthData,
  normalizeAuthData,
} from "../../domains";
import {
  ILoadAuthRepo,
  ILogoutRepo,
  ISetAuthStorageRepo,
} from "../../useCases";

export interface IAuthStorageDataSource {
  loadAuth(): IAuth | null;
  logout(): void;
  setAuth(auth: IAuth): void;
}

export class AuthStorageRepository
  implements ILoadAuthRepo, ILogoutRepo, ISetAuthStorageRepo
{
  private dataSource: IAuthStorageDataSource;

  constructor(dataSource: IAuthStorageDataSource) {
    this.dataSource = dataSource;
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
