import { AuthModel } from "../../domains/Auth";

export interface IAuthPresenter {
  setAuth(authModel: AuthModel): void;
  setError(error: string): void;
  setIsLoggingIn(isLoggingIn: boolean): void;
  setIsLoadingAuth(isLoading: boolean): void;
  setIsLoggingOut(isLoggingOut: boolean): void;
  logout(): void;
}
