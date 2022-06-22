import AuthStorageDataSource from "../../dataSource/Auth/authStorageDataSouce";
import { AuthModel } from "../../domains/Auth";
import { CredentialModel } from "../../domains/Credential";
import AuthStorageRepository from "../../repository/Auth/authStorageRepository";
import LocalStorage from "../../storage/localStorage";
import { IAuthPresenter } from "./../../presenter/Auth/IAuthPresenter";
import SetAuthStorageUseCase from "./setAuthStorageUseCase";

export interface ILoginRepo {
  login(credential: CredentialModel): Promise<AuthModel>;
}

export default class LoginUseCase {
  private repository: ILoginRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILoginRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute(credentialModel: CredentialModel) {
    this.presenter.setIsLoggingIn(true);
    this.presenter.setError("");

    try {
      const authModel = await this.repository.login(credentialModel);

      const setAuthStorageUseCase = new SetAuthStorageUseCase(
        new AuthStorageRepository(
          new AuthStorageDataSource(LocalStorage.getInstance())
        )
      );

      setAuthStorageUseCase.execute(authModel);

      this.presenter.setAuth(authModel);
    } catch (error) {
      this.presenter.setError(error);
    }

    this.presenter.setIsLoggingIn(false);
  }
}
