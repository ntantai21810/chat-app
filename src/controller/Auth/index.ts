import { AuthAPIDataSource } from "../../dataSource";
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

  login(phone: string, password: string) {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthAPIDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    authUseCase.login(phone, password);
  }

  register(phone: string, fullName: string, password: string) {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthAPIDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    authUseCase.register(phone, fullName, password);
  }

  loadAuth() {
    const authUseCase = new AuthUseCase(
      new AuthRepository(
        new AuthAPIDataSource(API.getIntance()),
        new LocalStorage()
      ),
      this.presenter
    );

    authUseCase.loadAuth();
  }
}
