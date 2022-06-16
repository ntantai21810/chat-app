import { IAuthPresenter } from "../../presenter/Auth/IAuthPresenter";

export interface ILogoutRepo {
  logout(): void;
}

export default class LogoutUseCase {
  private repository: ILogoutRepo;
  private presenter: IAuthPresenter;

  constructor(repository: ILogoutRepo, presenter: IAuthPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  execute() {
    this.presenter.setIsLoggingOut(true);

    this.repository.logout();
    this.presenter.logout();

    this.presenter.setIsLoggingOut(false);
  }
}
