import { AuthAPIDataSource } from "../../dataSource";
import { AuthModel } from "../../domains/Auth";
import { API } from "../../network";
import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";
import AuthRepository from "../../repository/Auth/authRepository";
import SetAuthUseCase from "./setAuthUseCase";

export interface ILoadAuthRepo {
  loadAuth(): AuthModel | null;
}

export default class LoadAuthCase {
  private repository: ILoadAuthRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILoadAuthRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  execute() {
    try {
      const authModel = this.repository.loadAuth();

      if (authModel) {
        const setAuthUseCase = new SetAuthUseCase(
          new AuthRepository(new AuthAPIDataSource(API.getIntance()))
        );

        setAuthUseCase.execute(authModel);

        this.presenter.setAuth(authModel);
      }
    } catch (error) {}

    this.presenter.setIsLoadingAuth(false);
  }
}
