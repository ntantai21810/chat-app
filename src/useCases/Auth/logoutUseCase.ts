import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";

export interface ILogoutRepo {
  logout(): Promise<boolean>;
}

export default class LogoutCase {
  private repository: ILogoutRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILogoutRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute() {
    this.presenter.setIsLoggingOut(true);

    try {
      await this.repository.logout();
    } catch (e) {}

    this.presenter.setIsLoggingOut(false);
  }
}
