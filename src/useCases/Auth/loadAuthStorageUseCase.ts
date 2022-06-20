import AuthAPIDataSource from "../../dataSource/Auth/authAPIDataSouce";
import { AuthModel } from "../../domains/Auth";
import API from "../../network/api/API";
import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";
import AuthAPIRepository from "../../repository/Auth/authAPIRepository";
import SetAuthAPIUseCase from "./setAuthAPIUseCase";

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
        const setAuthAPIUseCase = new SetAuthAPIUseCase(
          new AuthAPIRepository(new AuthAPIDataSource(API.getIntance()))
        );

        setAuthAPIUseCase.execute(authModel);

        this.presenter.setAuth(authModel);
      }
    } catch (error) {}

    this.presenter.setIsLoadingAuth(false);
  }
}
