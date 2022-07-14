import { AuthAPIDataSource, AuthStorageDataSource } from "../../dataSource";
import { modelCredentialData } from "../../domains";
import { API } from "../../network";
import { IAuthPresenter } from "../../presenter";
import { AuthAPIRepository, AuthStorageRepository } from "../../repository";
import { LocalStorage } from "../../storage";
import {
  LoadAuthCase,
  LoginUseCase,
  LogoutUseCase,
  RegisterUseCase,
} from "../../useCases";

export class AuthController {
  private presenter: IAuthPresenter;

  constructor(presenter: IAuthPresenter) {
    this.presenter = presenter;
  }

  login(phone: string, password: string) {
    try {
      const credentialModel = modelCredentialData({ phone, password });

      const loginUseCase = new LoginUseCase(
        new AuthAPIRepository(new AuthAPIDataSource(API.getIntance())),
        this.presenter
      );

      loginUseCase.execute(credentialModel);
    } catch (e) {
      console.log(e);
    }
  }

  register(
    phone: string,
    fullName: string,
    password: string,
    avatar: FileList
  ) {
    try {
      const credentialModel = modelCredentialData({
        phone,
        password,
        fullName,
        avatar,
      });

      const registerUseCase = new RegisterUseCase(
        new AuthAPIRepository(new AuthAPIDataSource(API.getIntance())),
        this.presenter
      );

      registerUseCase.execute(credentialModel);
    } catch (e) {
      console.log(e);
    }
  }

  loadAuth() {
    try {
      const loadAuthUseCase = new LoadAuthCase(
        new AuthStorageRepository(
          new AuthStorageDataSource(LocalStorage.getInstance())
        ),
        this.presenter
      );

      loadAuthUseCase.execute();
    } catch (e) {
      console.log(e);
    }
  }

  logout() {
    try {
      const logoutUsecase = new LogoutUseCase(
        new AuthStorageRepository(
          new AuthStorageDataSource(LocalStorage.getInstance())
        ),
        this.presenter
      );

      logoutUsecase.execute();
    } catch (e) {
      console.log(e);
    }
  }
}
