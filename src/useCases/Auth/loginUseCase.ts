import { AuthStorageDataSource } from "../../dataSource";
import { AuthModel, CredentialModel } from "../../domains";
import { IAuthPresenter } from "../../presenter";
import { AuthStorageRepository } from "../../repository";
import { LocalStorage } from "../../storage";
import { SetAuthStorageUseCase } from "./setAuthStorageUseCase";

export interface ILoginRepo {
  login(credential: CredentialModel): Promise<AuthModel>;
}

export class LoginUseCase {
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
      this.presenter.setIsLoggingIn(false);
      throw error;
    }

    this.presenter.setIsLoggingIn(false);
  }
}
