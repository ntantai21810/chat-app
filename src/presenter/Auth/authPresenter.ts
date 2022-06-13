import { getDispatch } from "../../adapter/frameworkAdapter";
import { AuthModel } from "../../domains/Auth";
import { normalizeAuthData } from "../../domains/Auth/helper";
import {
  resetAuth,
  setAuth,
  setAuthError,
  setAuthIsLoading,
  setAuthIsLoggingIn,
  setAuthIsLoggingOut,
} from "../../framework/redux/auth";
import { IAuthPresenter } from "./IAuthPresenter";

export default class AuthPresenter implements IAuthPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setAuth(authModel: AuthModel): void {
    const auth = normalizeAuthData(authModel);

    this.dispatch(setAuth(auth));
  }

  setError(error: string): void {
    this.dispatch(setAuthError(error));
  }

  setIsLoggingIn(isLoggingIn: boolean): void {
    this.dispatch(setAuthIsLoggingIn(isLoggingIn));
  }

  setIsLoadingAuth(isLoading: boolean): void {
    this.dispatch(setAuthIsLoading(isLoading));
  }

  setIsLoggingOut(isLoggingOut: boolean): void {
    this.dispatch(setAuthIsLoggingOut(isLoggingOut));
  }

  logout() {
    this.dispatch(resetAuth());
  }
}
