import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";

export interface ILogoutRepo {
  logout(): void;
}

export default class LogoutCase {
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
    } catch (e) {}

    this.presenter.setIsLoggingOut(false);
  }
}
