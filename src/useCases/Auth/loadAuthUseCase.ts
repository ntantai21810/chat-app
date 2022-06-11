import { AuthModel } from "../../domains/Auth";
import { CredentialModel } from "../../domains/Credential";
import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";

export interface ILoadAuthRepo {
  loadAuth(): Promise<AuthModel | null>;
}

export default class LoadAuthCase {
  private repository: ILoadAuthRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILoadAuthRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute() {
    this.presenter.setIsLoadingAuth(true);
    this.presenter.setError("");

    try {
      const authModel = await this.repository.loadAuth();

      if (authModel) {
        this.presenter.setAuth(authModel);
      } else {
        //Delete cookie if have -> clearAuth
      }
    } catch (error) {
      this.presenter.setError(error);
    }

    this.presenter.setIsLoadingAuth(false);
  }
}
