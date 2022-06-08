import { IAuthPresenter } from "./../../presenter/Auth/IAuthPresenter";
import { IAuthUseCase } from "./IAuthUseCase";
import { IAuthRepository } from "./../../repository/Auth/IAuthRepository";
import jwtDecode from "jwt-decode";

export default class AuthUseCase implements IAuthUseCase {
  private repository: IAuthRepository;
  private presenter: IAuthPresenter;

  constructor(repository: IAuthRepository, presenter?: IAuthPresenter) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  async login(phone: string, password: string) {
    this.presenter.setIsLogging(true);
    this.presenter.setError("");

    try {
      const authModel = await this.repository.login(phone, password);

      this.presenter.setAuth(authModel);
    } catch (error) {
      this.presenter.setError(error);
    }

    this.presenter.setIsLogging(false);
  }

  async register(phone: string, fullName: string, password: string) {
    this.presenter.setIsLogging(true);
    this.presenter.setError("");

    try {
      const authModel = await this.repository.register(
        phone,
        fullName,
        password
      );

      this.presenter.setAuth(authModel);
    } catch (error) {
      this.presenter.setError(error);
    }

    this.presenter.setIsLogging(false);
  }

  loadAuth(): void {
    const authModel = this.repository.getAuth();

    //Valid session
    if (
      authModel &&
      authModel.getAccessToken() &&
      !(jwtDecode<any>(authModel.getAccessToken()).exp < Date.now() / 1000)
    ) {
      this.presenter.setAuth(authModel);
    } else {
      this.repository.clearAuth();
    }
  }
}
