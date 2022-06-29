import { AuthAPIDataSource } from "../../dataSource";
import { AuthModel } from "../../domains";
import { API } from "../../network";
import { IAuthPresenter } from "../../presenter";
import { AuthAPIRepository } from "../../repository";
import { SetAuthAPIUseCase } from "./setAuthAPIUseCase";

export interface ILoadAuthRepo {
  loadAuth(): AuthModel | null;
}

export class LoadAuthCase {
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
    } catch (error) {
      this.presenter.setIsLoadingAuth(false);
      throw error;
    }

    this.presenter.setIsLoadingAuth(false);
  }
}
