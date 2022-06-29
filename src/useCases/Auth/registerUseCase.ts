import { AuthStorageDataSource } from "../../dataSource";
import { AuthModel, CredentialModel } from "../../domains";
import { IAuthPresenter } from "../../presenter";
import { AuthStorageRepository } from "../../repository";
import { LocalStorage } from "../../storage";
import { SetAuthStorageUseCase } from "./setAuthStorageUseCase";

export interface IRegisterRepo {
  register(credential: CredentialModel): Promise<AuthModel>;
}

export class RegisterUseCase {
  private repository: IRegisterRepo;
  private presenter: IAuthPresenter;

  constructor(repository: IRegisterRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute(credentialModel: CredentialModel) {
    this.presenter.setIsLoggingIn(true);
    this.presenter.setError("");

    try {
      const authModel = await this.repository.register(credentialModel);

      const setAuthUseCase = new SetAuthStorageUseCase(
        new AuthStorageRepository(
          new AuthStorageDataSource(LocalStorage.getInstance())
        )
      );

      setAuthUseCase.execute(authModel);

      this.presenter.setAuth(authModel);
    } catch (error) {
      this.presenter.setError(error);
      this.presenter.setIsLoggingIn(false);
      throw error;
    }

    this.presenter.setIsLoggingIn(false);
  }
}
