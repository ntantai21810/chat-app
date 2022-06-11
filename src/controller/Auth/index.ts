//Data source
import { AuthAPIDataSource } from "../../dataSource";

//Domain
import { modelCredentialData } from "../../domains/Credential";

//Network
import { API } from "../../network/api";

//Repo
import AuthRepository from "../../repository/Auth/authRepository";

//Use case
import LoadAuthCase from "../../useCases/Auth/loadAuthUseCase";
import LoginUseCase from "../../useCases/Auth/loginUseCase";
import LogoutCase from "../../useCases/Auth/logoutUseCase";

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

    const loginUseCase = new LoginUseCase(
      new AuthRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    loginUseCase.execute(credentialModel);
  }

  loadAuth() {
    const loadAuthUseCase = new LoadAuthCase(
      new AuthRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    loadAuthUseCase.execute();
  }

  logout() {
    const logoutUsecase = new LogoutCase(
      new AuthRepository(new AuthAPIDataSource(API.getIntance())),
      this.presenter
    );

    logoutUsecase.execute();
  }
}
