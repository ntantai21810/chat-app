import { IAuthPresenter } from "../../presenter";

export interface ILogoutRepo {
  logout(): void;
}

export class LogoutUseCase {
  private repository: ILogoutRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILogoutRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  execute() {
    this.presenter.setIsLoggingOut(true);

    try {
      this.repository.logout();
      this.presenter.logout();
    } catch (e) {
      this.presenter.setIsLoggingOut(false);
      throw e;
    }

    this.presenter.setIsLoggingOut(false);
  }
}
