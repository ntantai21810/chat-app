//Data source
import { AuthAPIDataSource } from "../../dataSource";
import AuthStorageDataSource from "../../dataSource/Auth/authStorageDataSouce";

//Domain
import { modelCredentialData } from "../../domains/Credential";

//Network
import { API } from "../../network/api";

//Repo
import AuthRepository from "../../repository/Auth/authRepository";
import LocalStorage from "../../storage/localStorage";

//Use case
import LoadAuthCase from "../../useCases/Auth/loadAuthUseCase";
import LoginUseCase from "../../useCases/Auth/loginUseCase";
import LogoutUseCase from "../../useCases/Auth/logoutUseCase";
import RegisterUseCase from "../../useCases/Auth/registerUseCase";

//Presenter
import { IAuthPresenter } from "./../../presenter/Auth/IAuthPresenter";

export default class AuthController {
  private presenter: IAuthPresenter;

  constructor(presenter: IAuthPresenter) {
    this.presenter = presenter;
  }

  login(phone: string, password: string) {
    const credentialModel = modelCredentialData({ phone, password });

    const loginUseCase = new LoginUseCase(
      new AuthRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    loginUseCase.execute(credentialModel);
  }

  register(phone: string, fullName: string, password: string) {
    const credentialModel = modelCredentialData({ phone, password, fullName });

    const registerUseCase = new RegisterUseCase(
      new AuthRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    registerUseCase.execute(credentialModel);
  }

  loadAuth() {
    const loadAuthUseCase = new LoadAuthCase(
      new AuthRepository(new AuthStorageDataSource(LocalStorage.getInstance())),
      this.presenter
    );

    loadAuthUseCase.execute();
  }

  logout() {
    const logoutUsecase = new LogoutUseCase(
      new AuthRepository(new AuthStorageDataSource(LocalStorage.getInstance())),
      this.presenter
    );

    logoutUsecase.execute();
  }
}
