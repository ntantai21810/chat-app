import { getDispatch } from "../../adapter/frameworkAdapter";
import { AuthModel, normalizeAuthData } from "../../domains";
import {
  logout,
  setAuth,
  setAuthError,
  setAuthIsLoading,
  setAuthIsLoggingIn,
  setAuthIsLoggingOut,
} from "../../framework/redux";
import { IAuthPresenter } from "./IAuthPresenter";

export class AuthPresenter implements IAuthPresenter {
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
    this.dispatch(logout());
  }
}
