//Data source
import AuthAPIDataSource from "../../dataSource/Auth/authAPIDataSouce";
import AuthStorageDataSource from "../../dataSource/Auth/authStorageDataSouce";

//Domain
import { modelCredentialData } from "../../domains/Credential";
import API from "../../network/api/API";
import AuthAPIRepository from "../../repository/Auth/authAPIRepository";

//Network

//Repo
import AuthRepository from "../../repository/Auth/authAPIRepository";
import AuthStorageRepository from "../../repository/Auth/authStorageRepository";
import LocalStorage from "../../storage/localStorage";

//Use case
import LoadAuthCase from "../../useCases/Auth/loadAuthStorageUseCase";
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
      new AuthAPIRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    loginUseCase.execute(credentialModel);
  }

  register(phone: string, fullName: string, password: string) {
    const credentialModel = modelCredentialData({ phone, password, fullName });

    const registerUseCase = new RegisterUseCase(
      new AuthAPIRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    registerUseCase.execute(credentialModel);
  }

  loadAuth() {
    const loadAuthUseCase = new LoadAuthCase(
      new AuthStorageRepository(
        new AuthStorageDataSource(LocalStorage.getInstance())
      ),
      this.presenter
    );

    loadAuthUseCase.execute();
  }

  logout() {
    const logoutUsecase = new LogoutUseCase(
      new AuthStorageRepository(
        new AuthStorageDataSource(LocalStorage.getInstance())
      ),
      this.presenter
    );

    logoutUsecase.execute();
  }
}
