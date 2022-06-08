import { AuthDataSource } from "../../dataSource";
import { API } from "../../network/api";
import { AuthRepository } from "../../repository";
import LocalStorage from "../../storage/localStorage";
import { AuthUseCase } from "../../useCases";
import { IAuthPresenter } from "./../../presenter/Auth/IAuthPresenter";

export default class AuthController {
  private presenter: IAuthPresenter;

  constructor(presenter: IAuthPresenter) {
    this.presenter = presenter;
  }

  async login(phone: string, password: string) {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    await authUseCase.login(phone, password);
  }

  async register(phone: string, fullName: string, password: string) {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    await authUseCase.register(phone, fullName, password);
  }

  async loadAuth() {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    authUseCase.loadAuth();
  }
}
