import { normalizeAuthData } from "../../controller/Auth/helper";
import { AuthModel } from "../../domains/Auth";
import {
  setAuth,
  setAuthError,
  setAuthIsLogging,
} from "../../framework/redux/auth";
import { store } from "../../framework/redux/store";
import { IAuthPresenter } from "./IAuthPresenter";

export default class AuthPresenter implements IAuthPresenter {
  private dispatch;

  constructor() {
    this.dispatch = store.dispatch;
  }

  setAuth(authModel: AuthModel): void {
    const auth = normalizeAuthData(authModel);

    this.dispatch(setAuth(auth));
  }

  setError(error: string): void {
    this.dispatch(setAuthError(error));
  }

  setIsLogging(isLogging: boolean): void {
    this.dispatch(setAuthIsLogging(isLogging));
  }
}
