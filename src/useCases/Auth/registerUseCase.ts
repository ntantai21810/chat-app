import { AuthModel } from "../../domains/Auth";
import { CredentialModel } from "../../domains/Credential";
import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";

export interface IRegisterRepo {
  register(credential: CredentialModel): Promise<AuthModel>;
}

export default class RegisterUseCase {
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

      this.presenter.setAuth(authModel);
    } catch (error) {
      this.presenter.setError(error);
    }

    this.presenter.setIsLoggingIn(false);
  }
}
